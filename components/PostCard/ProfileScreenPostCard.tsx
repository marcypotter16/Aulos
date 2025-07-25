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


const ProfileScreenPostCard = ({ post }: { post: ProfileScreenPost }) => {
    const { user } = useAuth()
    const handleDeletePost = async () => {
        const { error } = await supabase
            .from("posts")
            .delete()
            .eq("id", post.id)

        if (error) {
            showError(error, "Error in deleting post")
        }
    }
    const { theme } = useTheme();
    const [showLikeTooltip, setLikeTooltip] = React.useState(false);
    return (
        <View style={getStyles(theme).card}>
            <View style={getStyles(theme).header}>
                <Image source={{ uri: user!.avatar_url }} style={getStyles(theme).avatar} />
                <Text style={getStyles(theme).name}>{user!.name}</Text>
            </View>
            <Text style={getStyles(theme).text}>{post.content}</Text>
            {post.post_media && post.post_media.length > 0
                ? <Image source={{ uri: post.post_media[0].url }} style={getStyles(theme).postImage} />
                : null}
            <View style={getStyles(theme).actions}>
                <PostActionIcon name="trash-outline"
                    onPress={handleDeletePost}
                    color={getStyles(theme).text.color} />
            </View>
        </View>
    );
};

const getStyles = (theme: 'light' | 'dark') =>
    StyleSheet.create({
        card: {
            backgroundColor: theme === 'dark' ? darkThemeColors.surface : lightThemeColors.surface,
            marginVertical: 8,
            padding: 12,
            borderRadius: 12,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            marginHorizontal: 16,
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
            color: theme === 'dark' ? darkThemeColors.text : lightThemeColors.text,
        },
        postImage: {
            width: '100%',
            height: 180,
            borderRadius: 10,
            marginTop: 8,
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
