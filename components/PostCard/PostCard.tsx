import { darkThemeColors, lightThemeColors } from '@/constants';
import { useAuth } from '@/hooks/AuthContext';
import { useTheme } from '@/hooks/ThemeContext';
import Post from '@/models/post';
import { supabase } from '@/supabase';
import MediaListRenderer from '@/utils/media_rendering/MediaListRenderer';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Toast from 'react-native-toast-message';
import PostActionIcon from './PostActionIcon';

type Props = {
  post: Post;
  isVisible: boolean;
};

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive sizing based on screen size
const isTablet = screenWidth >= 768;
const isLargeScreen = screenWidth >= 1024;

const getPostCardHeight = () => {
  if (isLargeScreen) return screenHeight * 0.7; // 70% of screen height
  if (isTablet) return screenHeight * 0.6; // 60% of screen height
  return 'auto'; // Auto height for mobile
};

const PostCard = ({ post, isVisible }: Props) => {
  const { theme, colorScheme } = useTheme();
  console.log(colorScheme);
  
  const { user } = useAuth()
  const styles = useMemo(() => getStyles(theme), [theme]);
  const [isPostLikedByUser, setIsPostLikedByUser] = useState(post.isLikedByUser)
  const [likesCount, setLikesCount] = useState(post.likes_count)

  async function handleLike(): Promise<void> {
    if (!user) {
      Toast.show({
        type: "info",
        text1: "Not authenticated",
        text2: "You have to be authenticated to like a post, redirecting..."
      })
      setTimeout(() => router.push("/(auth)/login"), 2000)
      return
    }
    
    // Store original state for rollback
    const originalLikedState = isPostLikedByUser
    const originalLikesCount = likesCount
    
    // Optimistic UI update
    setIsPostLikedByUser(!isPostLikedByUser)
    setLikesCount(prevCount => isPostLikedByUser ? prevCount - 1 : prevCount + 1)
    
    try {
      if (isPostLikedByUser) {
        // Unlike the post - trigger will automatically decrement likes_count
        const { error } = await supabase
          .from("post_likes")
          .delete()
          .eq("user_id", user.id)
          .eq("post_id", post.id)
        
        if (error) throw error
        
      } else {
        // Like the post - trigger will automatically increment likes_count
        const { error } = await supabase
          .from("post_likes")
          .insert({ post_id: post.id, user_id: user.id })
        
        if (error) throw error
      }
      
      // Optionally, fetch the updated count from the database to ensure accuracy
      // (The trigger handles this, but we can sync for perfect accuracy)
      const { data: updatedPost } = await supabase
        .from("posts")
        .select("likes_count")
        .eq("id", post.id)
        .single()
      
      if (updatedPost) {
        setLikesCount(updatedPost.likes_count)
      }
      
    } catch (error) {
      // Rollback UI changes on error
      setIsPostLikedByUser(originalLikedState)
      setLikesCount(originalLikesCount)
      
      Toast.show({
        type: "error",
        text1: "Failed to update like",
        text2: "Please try again"
      })
      console.error("Error updating like:", error)
    }
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {post.userProfilePicture && (
          <Image source={{ uri: post.userProfilePicture }} style={styles.avatar} />
        )}
        {post.userName && <Text style={styles.name}>{post.userName}</Text>}
      </View>

      <Text style={styles.text}>{post.content}</Text>
        {post.post_media && <MediaListRenderer post_medias={post.post_media} isVisible={isVisible} />}
      {post.showActions && (
        <View style={styles.actions}>
          <View style={styles.likeButton}>
            <PostActionIcon name="musical-notes-outline" onPress={handleLike} color={
              isPostLikedByUser ? colorScheme.accent : colorScheme.text
            } />
            {likesCount > 0 && (
              <Text style={[styles.likesCountText, { color: isPostLikedByUser ? colorScheme.accent : colorScheme.text }]}>
                {likesCount}
              </Text>
            )}
          </View>
          <PostActionIcon name="chatbubble-outline" onPress={() => console.log('Commented!')} color={styles.text.color} />
          <PostActionIcon name="paper-plane-outline" onPress={() => console.log('Messaged!')} color={styles.text.color} />
          <PostActionIcon name="share-social-outline" onPress={() => console.log('Shared!')} color={styles.text.color} />
          <PostActionIcon name="bookmark-outline" onPress={() => console.log('Saved!')} color={styles.text.color} />
        </View>
      )}
    </View>
  );
};

const getStyles = (theme: 'light' | 'dark') => {
  const cardHeight = getPostCardHeight();

  return StyleSheet.create({
    card: {
      backgroundColor: theme === 'dark' ? darkThemeColors.surface : lightThemeColors.surface,
      marginVertical: isTablet ? 16 : 8,
      padding: isTablet ? 20 : 12,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      marginHorizontal: 16,
      minHeight: cardHeight,
      maxWidth: isLargeScreen ? 800 : undefined,
      alignSelf: isLargeScreen ? 'center' : 'stretch',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },
    avatar: {
      width: isTablet ? 50 : 40,
      height: isTablet ? 50 : 40,
      borderRadius: isTablet ? 25 : 20,
      marginRight: isTablet ? 12 : 10,
    },
    name: {
      fontWeight: 'bold',
      fontSize: isTablet ? 20 : 16,
      color: theme === 'dark' ? darkThemeColors.text : lightThemeColors.text,
    },
    text: {
      fontSize: isTablet ? 18 : 15,
      marginVertical: isTablet ? 12 : 8,
      color: theme === 'dark' ? darkThemeColors.text : lightThemeColors.text,
      lineHeight: isTablet ? 24 : 20,
    },
    actions: {
      flexDirection: 'row',
      marginTop: isTablet ? 16 : 10,
      justifyContent: 'space-around',
      paddingHorizontal: isTablet ? 20 : 10,
    },
    likeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: isTablet ? 6 : 4,
    },
    likesCountText: {
      fontSize: isTablet ? 16 : 14,
      fontWeight: '600',
      minWidth: isTablet ? 20 : 16,
      textAlign: 'center',
    },
  });
};

export default PostCard;
