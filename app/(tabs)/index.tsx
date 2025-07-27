import PostCard from '@/components/PostCard/PostCard';
import { darkThemeColors, lightThemeColors } from '@/constants';
import { useTheme } from '@/hooks/ThemeContext';
import Post from '@/models/post';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, View, ViewToken } from 'react-native';

// Generate more mock posts for pagination demo
const generateMockPost = (id: number): Post => ({
  id: `${id}`,
  user_id: `u${((id - 1) % 5) + 1}`,
  content: [
    'Looking for a bassist for my indie rock project in NYC 🎸',
    'Open to collabs for an online jazz jam. DM me! 🎷💬',
    'Just finished recording my new album! What do you think? 🎵',
    'Looking for a drummer to complete our band setup 🥁',
    'Anyone interested in a acoustic guitar session? ✨',
    'New synthesizer sounds amazing! Check this out 🎹',
    'Live performance tonight at The Blue Note 🎤',
  ][id % 7],
  caption: '',
  created_at: `2024-01-${String(id).padStart(2, '0')}`,
  updated_at: `2024-01-${String(id).padStart(2, '0')}`,
  visibility: 'public',
  likes_count: Math.floor(Math.random() * 50) + 1,
  comments_count: Math.floor(Math.random() * 10) + 1,
  userName: ['Alex Rivera', 'JazzQueen', 'RockStar99', 'MelodyMaker', 'BeatDrop'][((id - 1) % 5)],
  userProfilePicture: `https://i.pravatar.cc/100?img=${((id - 1) % 10) + 1}`,
  post_media: id % 3 === 0 ? [
    // Every 3rd post has audio
    {
      id: `m${id}_audio`,
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      type: 'audio',
    },
  ] : [
    // Other posts have mixed media
    {
      id: `m${id}_1`,
      url: id % 2 === 0 
        ? 'https://images.unsplash.com/photo-1511376777868-611b54f68947'
        : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      type: id % 2 === 0 ? 'image' : 'video',
    },
    ...(Math.random() > 0.6 ? [{
      id: `m${id}_2`,
      url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f',
      type: 'image' as const,
    }] : []),
  ],
  showActions: true,
});

// Generate a large dataset for pagination
const ALL_POSTS: Post[] = Array.from({ length: 50 }, (_, i) => generateMockPost(i + 1));

const POSTS_PER_PAGE = 10;

const FeedScreen = () => {
  const { theme } = useTheme();
  const [ visiblePostIds, setVisiblePostIds ] = useState<string[]>([]);
  const [ posts, setPosts ] = useState<Post[]>([]);
  const [ loading, setLoading ] = useState(false);
  const [ hasMore, setHasMore ] = useState(true);
  const [ currentPage, setCurrentPage ] = useState(0);
  
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const isTablet = screenWidth >= 768;
  const isLargeScreen = screenWidth >= 1024;

  // Load initial posts
  useEffect(() => {
    loadInitialPosts();
  }, []);

  const loadInitialPosts = () => {
    const initialPosts = ALL_POSTS.slice(0, POSTS_PER_PAGE);
    setPosts(initialPosts);
    setCurrentPage(1);
    setHasMore(ALL_POSTS.length > POSTS_PER_PAGE);
  };

  const loadMorePosts = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      const startIndex = currentPage * POSTS_PER_PAGE;
      const endIndex = startIndex + POSTS_PER_PAGE;
      const newPosts = ALL_POSTS.slice(startIndex, endIndex);
      
      if (newPosts.length > 0) {
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
        setCurrentPage(prev => prev + 1);
        setHasMore(endIndex < ALL_POSTS.length);
      } else {
        setHasMore(false);
      }
      
      setLoading(false);
    }, 500); // 500ms delay to simulate network
  }, [currentPage, loading, hasMore]);

  const onEndReached = () => {
    loadMorePosts();
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const ids = viewableItems.map((item) => item.item.id);
      setVisiblePostIds(ids);
    }
  );

  const renderItem = ({ item }: { item: Post }) => (
    <PostCard post={item} isVisible={visiblePostIds.includes(item.id)} />
  );

  const renderFooter = () => {
    if (!loading) return null;
    
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator 
          size={isTablet ? "large" : "small"} 
          color={theme === 'dark' ? darkThemeColors.primary : lightThemeColors.primary} 
        />
      </View>
    );
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      onViewableItemsChanged={onViewableItemsChanged.current}
      viewabilityConfig={{ 
        itemVisiblePercentThreshold: isTablet ? 70 : 50,
        minimumViewTime: 300 
      }}
      contentContainerStyle={getStyles(theme, isTablet, isLargeScreen).container}
      removeClippedSubviews
      showsVerticalScrollIndicator={false}
      // For tablets, add some spacing to make it clear which post is active
      ItemSeparatorComponent={() => isTablet ? <View style={{ height: 20 }} /> : null}
      // Pagination props
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      maxToRenderPerBatch={5}
      windowSize={10}
      initialNumToRender={5}
    />
  );
};

const styles = StyleSheet.create({
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const getStyles = (theme: 'dark' | 'light', isTablet: boolean, isLargeScreen: boolean) =>
  StyleSheet.create({
    container: {
      paddingVertical: isTablet ? 20 : 10,
      paddingHorizontal: isLargeScreen ? 40 : isTablet ? 20 : 0,
      backgroundColor: theme === 'dark' ? darkThemeColors.background : lightThemeColors.background,
      minHeight: '100%',
    },
  });

export default FeedScreen;
