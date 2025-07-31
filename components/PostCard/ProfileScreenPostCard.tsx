// Description: A reusable React Native component to display a post card with user information, text, and optional image and actions.

import { darkThemeColors, lightThemeColors } from '@/constants';
import { useAuth } from '@/hooks/AuthContext';
import { useTheme } from '@/hooks/ThemeContext';
import { PostMedia } from '@/models/post_media';
import { supabase } from '@/supabase';
import { showError } from '@/utils/ErrorUtils';
import React, { useCallback, useMemo } from 'react';
import { Dimensions, Platform, StyleSheet, Text, View } from 'react-native';
import MediaListRenderer from '@/utils/media_rendering/MediaListRenderer';
import PostActionIcon from './PostActionIcon';

export type ProfileScreenPost = {
    id: string,
    content: string,
    created_at: string,
    post_media: PostMedia[]
}


const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;
const isPhone = screenWidth < 768;

const ProfileScreenPostCard = ({ post, onPostDeleted }: { post: ProfileScreenPost, onPostDeleted: () => void }) => {
    const { user } = useAuth()
    const { theme, colorScheme } = useTheme();
    const styles = useMemo(() => getStyles(theme), [theme]);

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
    const getItemLayout = useCallback((data: any, index: number) => {
        // Calculate actual item width based on card width
        const cardWidth = screenWidth / 3 - 32; // Approximate card width in 3-column layout
        const itemWidth = cardWidth + 8; // Card width + margin
        return {
            length: itemWidth,
            offset: itemWidth * index,
            index,
        };
    }, []);

    return (
        <View style={styles.card}>
            {post.post_media && post.post_media.length > 0 && <MediaListRenderer post_medias={post.post_media} isVisible={true} />}
            <Text style={styles.text}>{post.content}</Text>
            <View style={styles.actions}>
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
            marginVertical: isPhone ? 8 : 6,
            marginHorizontal: isPhone ? 8 : 4,
            padding: isPhone ? 12 : 8,
            borderRadius: 16,
            shadowColor: '#000',
            shadowOpacity: theme === 'dark' ? 0.3 : 0.15,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
            elevation: 4,
            flex: 1,
            // Responsive width based on platform and screen size
            maxWidth: Platform.OS === 'web' 
                ? '31%' 
                : isPhone 
                    ? '100%'  // 1 column on phone
                    : '31%', // 3 columns on tablet
            borderWidth: theme === 'dark' ? 1 : 0,
            borderColor: theme === 'dark' ? darkThemeColors.text : 'transparent',
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
            fontSize: 12,
            marginVertical: 6,
            marginHorizontal: 4,
            color: theme === 'dark' ? darkThemeColors.text : lightThemeColors.text,
            lineHeight: 16,
            textAlign: 'center',
        },
        postImage: {
            width: '100%',
            aspectRatio: 1,
            borderRadius: 12,
            marginBottom: 6,
            resizeMode: 'cover',
            backgroundColor: theme === 'dark' ? darkThemeColors.background : lightThemeColors.background,
        },
        mediaWrapper: {
            marginRight: 4,
            width: '100%',
            alignItems: 'center',
        },
        singleMediaContainer: {
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
        },
        mediaSlideContainer: {
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            transform: [{ translateX: 0 }],
            ...(Platform.OS === 'web' && {
                transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }),
        },
        mediaSlideTransition: {
            ...(Platform.OS === 'web' && {
                transform: [{ translateX: 10 }],
                opacity: 0.8,
            }),
        },
        singleMediaWrapper: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        mediaIndicators: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 6,
            marginBottom: 4,
            gap: 4,
        },
        indicator: {
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: theme === 'dark' ? darkThemeColors.secondary : lightThemeColors.secondary,
            opacity: 0.5,
        },
        activeIndicator: {
            backgroundColor: theme === 'dark' ? darkThemeColors.primary : lightThemeColors.primary,
            opacity: 1,
            width: 8,
            height: 8,
            borderRadius: 4,
        },
        webNavigation: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 4,
            paddingHorizontal: 8,
        },
        navButton: {
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: theme === 'dark' ? darkThemeColors.primary : lightThemeColors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 2,
        },
        navButtonDisabled: {
            backgroundColor: theme === 'dark' ? darkThemeColors.secondary : lightThemeColors.secondary,
            opacity: 0.5,
        },
        mediaCounter: {
            fontSize: 10,
            fontWeight: '500',
            color: theme === 'dark' ? darkThemeColors.text : lightThemeColors.text,
            backgroundColor: theme === 'dark' ? darkThemeColors.surface : lightThemeColors.surface,
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 8,
            overflow: 'hidden',
        },

        actions: {
            flexDirection: 'row',
            marginTop: 4,
            justifyContent: 'center',
            paddingVertical: 4,
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
