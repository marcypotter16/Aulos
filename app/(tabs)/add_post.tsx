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
                created_at: new Date().toISOString().toString(),
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
                    const media = medias[ index ];

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

                    // const publicUrl = supabase.storage
                    //     .from("post-media-bucket")
                    //     .getPublicUrl(uploadPath).data.publicUrl;

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
                        showError(result2.error, "Error inserting in the post_media table")
                        console.error(result2.error.message)
                        return;
                    }
                }
            }
        } catch (err) {
            showError(err as Error, "Unknown error during upload")
            console.error(err)
        } finally {
            setLoading(false);
        }
    };

    const PublishButton = () => {
        return (
            <View style={{
                flexDirection: 'column',
                justifyContent: 'space-around',
                backgroundColor: theme === 'dark' ? darkThemeColors.primary : lightThemeColors.primary,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: 'white'
            }}>
                <TouchableOpacity onPress={handlePost}>
                    {/* <Ionicons name='arrow-up-circle-outline' size={40}
                        color={theme === 'dark' ? darkThemeColors.accent : lightThemeColors.accent} /> */}
                    <Text style={{
                        color: theme === 'dark' ? darkThemeColors.text : lightThemeColors.text,
                        fontSize: 18,
                        margin: 10,
                    }}>Publish</Text>
                </TouchableOpacity>
            </View>
        )
    }


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
        color: theme === 'light' ? lightThemeColors.text : darkThemeColors.text,
        height: 60,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
});