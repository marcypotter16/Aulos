// Description: A reusable React Native component to display a post card with user information, text, and optional image and actions.

import { darkThemeColors, lightThemeColors } from '@/constants';
import { useAuth } from '@/hooks/AuthContext';
import { useTheme } from '@/hooks/ThemeContext';
import { supabase } from '@/supabase';
import { showError } from '@/utils/ErrorUtils';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import PostActionIcon from './PostActionIcon';

export type ProfileScreenPost = {
    id: string,
    content: string,
    created_at: string,
    post_media: {
        id: string,
        url: string,
        type: string
    }[]

}


const ProfileScreenPostCard = ({ post, onPostDeleted }: { post: ProfileScreenPost, onPostDeleted: () => void }) => {
    const { user } = useAuth()
    const handleDeletePost = async () => {
        const { error } = await supabase
            .from("posts")
            .delete()
            .eq("id", post.id)

        if (error) {
            showError(error, "Error in deleting post")
        } else {
            onPostDeleted() // This is made to trigger something in the parent component!
        }
    }
    const { theme, colorScheme } = useTheme();
    const [ showLikeTooltip, setLikeTooltip ] = React.useState(false);
    return (
        <View style={getStyles(theme).card}>
            {post.post_media && post.post_media.length > 0
                ? <Image source={{ uri: post.post_media[ 0 ].url }} style={getStyles(theme).postImage} />
                : null}
            <Text style={getStyles(theme).text}>{post.content}</Text>
            <View style={getStyles(theme).actions}>
                <PostActionIcon name="trash-outline"
                    onPress={handleDeletePost}
                    color={colorScheme.accent}
                />
            </View>
        </View>
    );
};

const getStyles = (theme: 'light' | 'dark') =>
    StyleSheet.create({
        card: {
            backgroundColor: theme === 'dark' ? darkThemeColors.surface : lightThemeColors.surface,
            marginVertical: 8,
            padding: 5,
            borderRadius: 12,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            marginHorizontal: 16,
            width: '10%'
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 6,
        },
        avatar: {
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 10,
        },
        name: {
            fontWeight: 'bold',
            fontSize: 16,
            color: theme === 'dark' ? darkThemeColors.text : lightThemeColors.text,
        },
        text: {
            fontSize: 15,
            marginVertical: 8,
            marginLeft: 10,
            color: theme === 'dark' ? darkThemeColors.text : lightThemeColors.text,
        },
        postImage: {
            width: '100%',
            aspectRatio: 1, // 👈 Makes image square and keeps proportions
            borderRadius: 10,
            marginTop: 8,
            resizeMode: 'cover', // 👈 Ensures proper cropping instead of stretching
        },

        actions: {
            flexDirection: 'row',
            marginTop: 10,
            justifyContent: 'space-around',
        },
        action: {
            fontSize: 14,
            color: theme === 'dark' ? darkThemeColors.primary : lightThemeColors.primary,
        },
        tooltip: {
            position: 'absolute',
            bottom: 25,
            left: 115,
            backgroundColor: 'black',
            paddingVertical: 2,
            paddingHorizontal: 6,
            borderRadius: 4,
            zIndex: 10,
        },
        tooltipText: {
            color: 'white',
            fontSize: 12,
        },
    });

export default ProfileScreenPostCard;
