import { darkThemeColors, lightThemeColors } from '@/constants';
import { useAuth } from '@/hooks/AuthContext';
import { useTheme } from '@/hooks/ThemeContext';
import { useRedirectIfUnauthenticated } from '@/hooks/useRedirectIfNotAuthenticated';
import { supabase } from '@/supabase'; // your initialized client
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { v4 } from 'uuid';

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
    const [content, setContent] = useState('');
    const [medias, setMedias] = useState<MediaItem[] | null>(null);
    const [visibility, setVisibility] = useState<'public' | 'private'>('public');
    const [loading, setLoading] = useState(false);

    const POST_ID = v4()

    const pickMedia = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: ['video/*', 'audio/*', 'image/*'],
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

        console.log(pickedAssets)

        setMedias(pickedAssets);
    };

    const handlePost = async () => {
        setLoading(true);
        try {
            // First insert the post in posts!
            const { error: postError } = await supabase.from('posts').insert({
                id: POST_ID,
                user_id: user?.id,
                content: content,
                visibility: visibility,
            });

            if (postError) throw postError;

            Toast.show({
                type: "success",
                text1: "Upload successful"
            })
            router.back()

            // Then insert the media in the bucket
            if (medias && medias.length > 0) {
                for (let index = 0; index < medias.length; index++) {
                    const media = medias[index];

                    const uploadPath = `${POST_ID}/${media.name}`;
                    const result = await supabase.storage
                        .from("post-media-bucket")
                        .upload(uploadPath, media.file, {
                            contentType: media.type,
                            upsert: true,
                        });

                    if (result.error) {
                        Toast.show({
                            type: "error",
                            text1: "Error uploading to Supabase Storage",
                            text2: result.error.message,
                        });
                        return;
                    }

                    const publicUrl = supabase.storage
                        .from("post-media-bucket")
                        .getPublicUrl(uploadPath).data.publicUrl;

                    const baseType = media.type.startsWith("video")
                        ? "video"
                        : media.type.startsWith("audio")
                            ? "audio"
                            : "image";
                    
                    // Insert also the "reference" of this media in the post_media table
                    const result2 = await supabase
                        .from("post_media")
                        .insert({
                            post_id: POST_ID,
                            url: publicUrl,
                            type: baseType,
                            position: index,
                        });

                    if (result2.error) {
                        Toast.show({
                            type: "error",
                            text1: "Error inserting into post_media table",
                            text2: result2.error.message,
                        });
                        console.error(result2.error.message)
                        return;
                    }
                }
            }
        } catch (err) {
            Toast.show({
                type: "error",
                text1: "Unexpected error during upload",
                text2: err instanceof Error ? err.message : String(err),
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles(theme).container}>
            <TextInput
                placeholder="Write something..."
                value={content}
                onChangeText={setContent}
                multiline
                style={styles(theme).input}
            />
            <View style={styles(theme).buttonContainer}>
                <TouchableOpacity onPress={pickMedia}>
                    <Ionicons name='image-outline' size={40}
                        color={theme === 'dark' ? 'white' : 'black'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePost}>
                    <Ionicons name='arrow-up-circle-outline' size={40}
                        color={theme === 'dark' ? darkThemeColors.accent : lightThemeColors.accent} />
                </TouchableOpacity>
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
        color: theme === 'light' ? lightThemeColors.text : darkThemeColors.text,
        height: 60,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
});