import { darkThemeColors, lightThemeColors } from '@/constants';
import { useTheme } from '@/hooks/ThemeContext';
import Post from '@/models/post';
import React, { useMemo } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';
import MediaListRenderer from '@/utils/media_rendering/MediaListRenderer';
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
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

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
          <PostActionIcon name="musical-notes-outline" onPress={() => console.log('Liked!')} color={styles.text.color} />
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
  });
};

export default PostCard;
