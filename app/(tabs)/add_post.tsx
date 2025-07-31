import { darkThemeColors, lightThemeColors } from '@/constants';
import { useAuth } from '@/hooks/AuthContext';
import { useTheme } from '@/hooks/ThemeContext';
import { useRedirectIfUnauthenticated } from '@/hooks/useRedirectIfNotAuthenticated';
import { PostMediaInsert } from '@/models/post_media';
import { supabase } from '@/supabase'; // your initialized client
import { showError } from '@/utils/ErrorUtils';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import uuid from 'react-native-uuid';

type MediaItem = {
    uri: string;
    file: Blob;
    name: string;
    type: string; // mimetype like 'video/mp4', 'image/jpeg', etc.
};


export default function AddPostScreen() {
    useRedirectIfUnauthenticated("/login")
    const { user } = useAuth()
    const { theme } = useTheme()
    const [ content, setContent ] = useState('');
    const [ medias, setMedias ] = useState<MediaItem[] | null>(null);
    const [ visibility, setVisibility ] = useState<'public' | 'private'>('public');
    const [ loading, setLoading ] = useState(false);
    const [ uploadProgress, setUploadProgress ] = useState<{[key: string]: number}>({});
    const [ isUploading, setIsUploading ] = useState(false);

    const POST_ID = uuid.v4()

    const pickMedia = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: [ 'video/*', 'audio/*', 'image/*' ],
            multiple: true,
        });

        if (result.canceled || !result.assets?.length) {
            Toast.show({
                type: 'info',
                text1: 'Selection canceled or no files selected',
            });
            return;
        }

        const pickedAssets = result.assets.map(asset => ({
            uri: asset.uri,
            file: asset.file!,
            name: asset.name,
            type: asset.mimeType ?? 'unknown',
        }));

        // Check file sizes (Supabase free tier has 50MB limit)
        const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes
        const oversizedFiles = pickedAssets.filter(asset => asset.file.size > MAX_FILE_SIZE);
        
        if (oversizedFiles.length > 0) {
            Toast.show({
                type: 'error',
                text1: 'File too large',
                text2: `Files must be under 50MB. Found ${oversizedFiles.length} oversized file(s).`,
            });
            return;
        }

        // Filter out duplicates based on file name and size
        const existingFiles = medias || [];
        const newFiles = pickedAssets.filter(newAsset => 
            !existingFiles.some(existing => 
                existing.name === newAsset.name && existing.file.size === newAsset.file.size
            )
        );

        if (newFiles.length === 0) {
            Toast.show({
                type: 'info',
                text1: 'No new files',
                text2: 'All selected files are already added.',
            });
            return;
        }

        console.log('Adding new files:', newFiles);
        setMedias(prev => [...(prev || []), ...newFiles]);
        
        Toast.show({
            type: 'success',
            text1: `Added ${newFiles.length} file(s)`,
            text2: `Total: ${(existingFiles.length + newFiles.length)} files`,
        });
    };

    const clearAllMedia = () => {
        setMedias(null);
        Toast.show({
            type: 'info',
            text1: 'Media cleared',
            text2: 'All selected files have been removed.',
        });
    };

    const removeMediaItem = (index: number) => {
        if (!medias) return;
        const newMedias = medias.filter((_, i) => i !== index);
        setMedias(newMedias.length > 0 ? newMedias : null);
        
        Toast.show({
            type: 'info',
            text1: 'File removed',
            text2: `${newMedias.length} file(s) remaining`,
        });
    };

    const handlePost = async () => {
        setLoading(true);
        setIsUploading(true);
        setUploadProgress({});
        
        try {
            // First insert the post in posts!
            const { error: postError } = await supabase.from('posts').insert({
                id: POST_ID,
                user_id: user?.id,
                content: content,
                created_at: new Date().toISOString().toString(),
                visibility: visibility,
            });

            if (postError) throw postError;

            // Then insert the media in the bucket
            if (medias && medias.length > 0) {
                for (let index = 0; index < medias.length; index++) {
                    const media = medias[index];
                    const uploadPath = `${POST_ID}/${media.name}`;
                    
                    // Update progress for this file
                    setUploadProgress(prev => ({ ...prev, [media.name]: 0 }));

                    const result = await supabase.storage
                        .from("post-media-bucket")
                        .upload(uploadPath, media.file, {
                            contentType: media.type,
                            upsert: true,
                        });

                    if (result.error) {
                        // Clean up the post if media upload fails
                        await supabase.from('posts').delete().eq('id', POST_ID);
                        
                        Toast.show({
                            type: "error",
                            text1: "Upload failed",
                            text2: result.error.message.includes('maximum file size') 
                                ? "File too large. Try a smaller file." 
                                : result.error.message,
                        });
                        return;
                    }

                    // Mark this file as complete
                    setUploadProgress(prev => ({ ...prev, [media.name]: 100 }));

                    const baseType = media.type.startsWith("video")
                        ? "video"
                        : media.type.startsWith("audio")
                            ? "audio"
                            : "image";

                    // Insert also the "reference" of this media in the post_media table
                    const postMedia: PostMediaInsert = {
                        post_id: POST_ID,
                        type: baseType,
                        position: index,
                        created_at: new Date().toISOString().toString(),
                        media_path: uploadPath
                    }
                    
                    const result2 = await supabase
                        .from("post_media")
                        .insert(postMedia);

                    if (result2.error) {
                        // Clean up the post and uploaded media if database insert fails
                        await supabase.from('posts').delete().eq('id', POST_ID);
                        await supabase.storage.from("post-media-bucket").remove([uploadPath]);
                        
                        showError(result2.error, "Error saving media reference")
                        console.error(result2.error.message)
                        return;
                    }
                }
            }

            // Only show success after everything is complete
            Toast.show({
                type: "success",
                text1: "Post published successfully!",
                text2: medias?.length ? `Uploaded ${medias.length} media file(s)` : undefined
            });
            
            router.back();
            
        } catch (err) {
            // Clean up the post if something goes wrong
            await supabase.from('posts').delete().eq('id', POST_ID);
            
            showError(err as Error, "Upload failed")
            console.error(err)
        } finally {
            setLoading(false);
            setIsUploading(false);
            setUploadProgress({});
        }
    };

    const PublishButton = () => {
        const isDisabled = loading || isUploading;
        
        return (
            <TouchableOpacity 
                style={[
                    styles(theme).publishButton,
                    isDisabled && styles(theme).publishButtonDisabled
                ]}
                onPress={handlePost} 
                disabled={isDisabled}
            >
                <Ionicons 
                    name={isUploading ? 'cloud-upload-outline' : loading ? 'hourglass-outline' : 'send'} 
                    size={20} 
                    color={theme === 'dark' ? darkThemeColors.text : '#fff'}
                    style={{ marginRight: 8 }}
                />
                <Text style={[
                    styles(theme).publishButtonText,
                    isDisabled && styles(theme).publishButtonTextDisabled
                ]}>
                    {isUploading ? 'Uploading...' : loading ? 'Publishing...' : 'Publish'}
                </Text>
            </TouchableOpacity>
        )
    }


    const renderUploadProgress = () => {
        if (!isUploading || Object.keys(uploadProgress).length === 0) return null;
        
        return (
            <View style={styles(theme).progressContainer}>
                <Text style={styles(theme).progressTitle}>Uploading files...</Text>
                {Object.entries(uploadProgress).map(([fileName, progress]) => (
                    <View key={fileName} style={styles(theme).progressItem}>
                        <Text style={styles(theme).fileName} numberOfLines={1}>
                            {fileName}
                        </Text>
                        <View style={styles(theme).progressBar}>
                            <View style={[
                                styles(theme).progressFill,
                                { width: `${progress}%` }
                            ]} />
                        </View>
                        <Text style={styles(theme).progressText}>{progress}%</Text>
                    </View>
                ))}
            </View>
        );
    };

    return (
        <View style={styles(theme).container}>
            <TextInput
                placeholder="Write something..."
                value={content}
                onChangeText={setContent}
                multiline
                style={styles(theme).input}
                editable={!isUploading}
            />
            
            {medias && medias.length > 0 && (
                <View style={styles(theme).mediaPreview}>
                    <View style={styles(theme).mediaHeader}>
                        <Text style={styles(theme).mediaCount}>
                            {medias.length} file(s) selected
                        </Text>
                        <TouchableOpacity 
                            style={styles(theme).clearAllButton}
                            onPress={clearAllMedia}
                            disabled={isUploading}
                        >
                            <Ionicons 
                                name="trash-outline" 
                                size={16} 
                                color={isUploading ? '#666' : '#ff4444'} 
                            />
                            <Text style={[
                                styles(theme).clearAllText,
                                isUploading && { color: '#666' }
                            ]}>
                                Clear All
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {medias.map((media, index) => (
                        <View key={index} style={styles(theme).mediaItem}>
                            <View style={styles(theme).mediaInfo}>
                                <Text style={styles(theme).mediaName} numberOfLines={1}>
                                    {media.name}
                                </Text>
                                <Text style={styles(theme).mediaSize}>
                                    {(media.file.size / 1024 / 1024).toFixed(1)}MB
                                </Text>
                            </View>
                            <TouchableOpacity 
                                style={styles(theme).removeButton}
                                onPress={() => removeMediaItem(index)}
                                disabled={isUploading}
                            >
                                <Ionicons 
                                    name="close-circle" 
                                    size={20} 
                                    color={isUploading ? '#666' : '#ff4444'} 
                                />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}
            
            {renderUploadProgress()}
            
            <View style={styles(theme).fileSizeLimitContainer}>
                <Ionicons 
                    name="information-circle-outline" 
                    size={16} 
                    color={theme === 'dark' ? darkThemeColors.text : lightThemeColors.text} 
                />
                <Text style={styles(theme).fileSizeLimitText}>
                    Maximum file size: 50MB per file
                </Text>
            </View>
            
            <View style={styles(theme).buttonContainer}>
                <TouchableOpacity 
                    style={[
                        styles(theme).mediaButton,
                        isUploading && styles(theme).mediaButtonDisabled
                    ]}
                    onPress={pickMedia} 
                    disabled={isUploading}
                >
                    <Ionicons 
                        name='image-outline' 
                        size={24}
                        color={isUploading ? '#666' : (theme === 'dark' ? darkThemeColors.text : lightThemeColors.text)} 
                    />
                    <Text style={[
                        styles(theme).mediaButtonText,
                        isUploading && styles(theme).mediaButtonTextDisabled
                    ]}>
                        Add Media
                    </Text>
                </TouchableOpacity>
                <PublishButton />
            </View>
        </View>
    );
}


const styles = (theme: 'light' | 'dark') => StyleSheet.create({
    container: { flex: 1, padding: 16, minHeight: "100%", backgroundColor: theme === 'light' ? lightThemeColors.background : darkThemeColors.background },
    input: {
        backgroundColor: theme === 'light' ? lightThemeColors.surface : darkThemeColors.surface,
        color: theme === 'light' ? lightThemeColors.text : darkThemeColors.text,
        height: 200,
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    buttonContainer: {
        backgroundColor: theme === 'light' ? lightThemeColors.surface : darkThemeColors.surface,
        borderColor: '#ccc',
        borderRadius: 12,
        borderWidth: 1,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    publishButton: {
        backgroundColor: theme === 'light' ? lightThemeColors.primary : darkThemeColors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 120,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    publishButtonDisabled: {
        backgroundColor: '#666',
        opacity: 0.6,
    },
    publishButtonText: {
        color: theme === 'light' ? '#fff' : darkThemeColors.text,
        fontSize: 16,
        fontWeight: '600',
    },
    publishButtonTextDisabled: {
        color: '#ccc',
    },
    mediaButton: {
        backgroundColor: 'transparent',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: theme === 'light' ? lightThemeColors.primary : darkThemeColors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mediaButtonDisabled: {
        borderColor: '#666',
        opacity: 0.5,
    },
    mediaButtonText: {
        color: theme === 'light' ? lightThemeColors.primary : darkThemeColors.primary,
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 8,
    },
    mediaButtonTextDisabled: {
        color: '#666',
    },
    fileSizeLimitContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme === 'light' ? '#f8f9fa' : '#2a2a2a',
        padding: 8,
        borderRadius: 6,
        marginBottom: 12,
    },
    fileSizeLimitText: {
        color: theme === 'light' ? '#666' : '#aaa',
        fontSize: 12,
        marginLeft: 6,
        fontStyle: 'italic',
    },
    mediaPreview: {
        backgroundColor: theme === 'light' ? lightThemeColors.surface : darkThemeColors.surface,
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    mediaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    mediaCount: {
        color: theme === 'light' ? lightThemeColors.text : darkThemeColors.text,
        fontWeight: 'bold',
        fontSize: 16,
    },
    clearAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme === 'light' ? '#ffe6e6' : '#4a2b2b',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#ff4444',
    },
    clearAllText: {
        color: '#ff4444',
        fontSize: 12,
        fontWeight: '500',
        marginLeft: 4,
    },
    mediaItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        borderBottomColor: theme === 'light' ? '#eee' : '#444',
    },
    mediaInfo: {
        flex: 1,
        marginRight: 12,
    },
    mediaName: {
        color: theme === 'light' ? lightThemeColors.text : darkThemeColors.text,
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 2,
    },
    mediaSize: {
        color: theme === 'light' ? '#666' : '#aaa',
        fontSize: 12,
    },
    removeButton: {
        padding: 4,
    },
    progressContainer: {
        backgroundColor: theme === 'light' ? lightThemeColors.surface : darkThemeColors.surface,
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    progressTitle: {
        color: theme === 'light' ? lightThemeColors.text : darkThemeColors.text,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    progressItem: {
        marginBottom: 8,
    },
    fileName: {
        color: theme === 'light' ? lightThemeColors.text : darkThemeColors.text,
        fontSize: 14,
        marginBottom: 4,
    },
    progressBar: {
        height: 6,
        backgroundColor: '#ddd',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 2,
    },
    progressFill: {
        height: '100%',
        backgroundColor: theme === 'light' ? lightThemeColors.primary : darkThemeColors.primary,
        borderRadius: 3,
    },
    progressText: {
        color: theme === 'light' ? lightThemeColors.text : darkThemeColors.text,
        fontSize: 12,
        textAlign: 'right',
    },
});