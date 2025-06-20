import PostCard from '@/components/PostCard/PostCard';
import { darkThemeColors, lightThemeColors } from '@/constants';
import { useTheme } from '@/hooks/ThemeContext';
import Post from '@/models/post';
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';

const posts: Post[] = [
  {
    id: '1',
    userName: 'Alex Rivera',
    userProfilePicture: 'https://i.pravatar.cc/100?img=1',
    image: 'https://images.unsplash.com/photo-1511376777868-611b54f68947',
    text: 'Looking for a bassist for my indie rock project in NYC 🎸',
    showActions: true,
  },
  {
    id: '2',
    userName: 'JazzQueen',
    userProfilePicture: 'https://i.pravatar.cc/100?img=2',
    image: '',
    text: 'Open to collabs for an online jazz jam. DM me! 🎷💬',
    showActions: true,
  },
  // Add more dummy posts here
];

const FeedScreen = () => {
  const { theme } = useTheme();
  const colorScheme = theme === 'dark' ? darkThemeColors : lightThemeColors;

  // Function to render each post item
  const renderItem = ({ item }: { item: Post }) => (
    <PostCard post={item} /> // Use PostCard component to render each post (see components/post_card.tsx)
  );

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={getStyles(theme).container}
    />
  );
};

const getStyles = (theme: 'dark' | 'light') =>
  StyleSheet.create({
    container: {
      paddingVertical: 10,
      backgroundColor: theme === 'dark' ? darkThemeColors.background : lightThemeColors.background,
      minHeight: '100%', // Ensure the container takes full height
    },
    
  });

export default FeedScreen;
