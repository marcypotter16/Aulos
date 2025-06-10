import PostCard from '@/components/post_card';
import Post from '@/models/post';
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';

const posts: Post[] = [
  {
    id: '1',
    name: 'Alex Rivera',
    avatar: 'https://i.pravatar.cc/100?img=1',
    image: 'https://images.unsplash.com/photo-1511376777868-611b54f68947',
    text: 'Looking for a bassist for my indie rock project in NYC 🎸',
    showActions: true,
  },
  {
    id: '2',
    name: 'JazzQueen',
    avatar: 'https://i.pravatar.cc/100?img=2',
    image: '',
    text: 'Open to collabs for an online jazz jam. DM me! 🎷💬',
    showActions: true,
  },
  // Add more dummy posts here
];

const FeedScreen = () => {
  const renderItem = ({ item }: { item: Post }) => (
    <PostCard post={item} />
  );

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
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
  },
  text: {
    fontSize: 15,
    marginVertical: 8,
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
    color: '#444',
  },
});

export default FeedScreen;
