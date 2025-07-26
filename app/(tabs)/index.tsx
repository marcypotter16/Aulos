import PostCard from '@/components/PostCard/PostCard';
import { darkThemeColors, lightThemeColors } from '@/constants';
import { useTheme } from '@/hooks/ThemeContext';
import Post from '@/models/post';
import React, { useRef, useState } from 'react';
import { FlatList, StyleSheet, ViewToken } from 'react-native';

const posts: Post[] = [
  {
    id: '1',
    user_id: 'u1',
    content: 'Looking for a bassist for my indie rock project in NYC 🎸',
    caption: '',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    visibility: 'public',
    likes_count: 12,
    comments_count: 3,
    userName: 'Alex Rivera',
    userProfilePicture: 'https://i.pravatar.cc/100?img=1',
    post_media: [
      {
        id: 'm1',
        url: 'https://images.unsplash.com/photo-1511376777868-611b54f68947',
        type: 'image',
      },
      {
        id: 'm2',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        type: 'video',
      },
      {
        id: 'm3',
        url: 'https://images.unsplash.com/photo-1511376777868-611b54f68947',
        type: 'image',
      },
      {
        id: 'm4',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        type: 'video',
      },
    ],
    showActions: true,
  },
  {
    id: '2',
    user_id: 'u2',
    content: 'Open to collabs for an online jazz jam. DM me! 🎷💬',
    caption: '',
    created_at: '2024-01-02',
    updated_at: '2024-01-02',
    visibility: 'public',
    likes_count: 5,
    comments_count: 1,
    userName: 'JazzQueen',
    userProfilePicture: 'https://i.pravatar.cc/100?img=2',
    post_media: [
      {
        id: 'm3',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        type: 'audio',
      },
    ],
    showActions: true,
  },
];

const FeedScreen = () => {
  const { theme } = useTheme();
  const [ visiblePostIds, setVisiblePostIds ] = useState<string[]>([]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const ids = viewableItems.map((item) => item.item.id);
      setVisiblePostIds(ids);
    }
  );

  const renderItem = ({ item }: { item: Post }) => (
    <PostCard post={item} isVisible={visiblePostIds.includes(item.id)} />
  );

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      onViewableItemsChanged={onViewableItemsChanged.current}
      viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
      contentContainerStyle={getStyles(theme).container}
      removeClippedSubviews
    />
  );
};

const getStyles = (theme: 'dark' | 'light') =>
  StyleSheet.create({
    container: {
      paddingVertical: 10,
      backgroundColor: theme === 'dark' ? darkThemeColors.background : lightThemeColors.background,
      minHeight: '100%',
    },
  });

export default FeedScreen;
