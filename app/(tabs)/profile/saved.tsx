import Post from '@/models/post';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';

const savedPosts: Post[] = [
  {
    id: '10',
    name: 'Lila Bassline',
    avatar: 'https://i.pravatar.cc/100?img=10',
    image: 'https://images.unsplash.com/photo-1580445650039-d53e9b4c18d3',
    text: 'Experienced bassist available for jazz/funk gigs. 🎸',
  },
  {
    id: '11',
    name: 'Gabe Drums',
    avatar: 'https://i.pravatar.cc/100?img=11',
    image: '',
    text: 'Need a guitarist for an indie band project in Austin.',
  },
];

const SavedScreen = () => {
  const renderItem = ({ item }: { item: Post }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{item.name}</Text>
      </View>
      <Text style={styles.text}>{item.text}</Text>
      {item.image ? <Image source={{ uri: item.image }} style={styles.postImage} /> : null}
    </View>
  );

  return (
    <FlatList
      data={savedPosts}
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
});

export default SavedScreen;
