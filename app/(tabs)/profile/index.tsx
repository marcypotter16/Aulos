import PostCard from '@/components/PostCard/PostCard';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import Post from '@/models/post';
import { Review } from '@/models/review';
import User from '@/models/user';
import { Link } from 'expo-router';
import React from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const mockUser: User = {
  id: '1',
  name: 'Alex Drummer',
  username: 'alex.drummer',
  email: '',
  password: '',
  createdAt: Date.now(),
  profilePicture: 'https://placehold.co/100x100',
  playedInstruments: ['Drums'],
  bio: 'Session drummer | Jazz & Funk | Available for gigs',
  rating: 4.8,
  reviews: [
    {
      id: 'r1',
      authorId: 'author1',
      authorName: 'John D.',
      reviewedId: '1',
      content: 'Amazing timing and great energy live!',
      rating: 5,
    },
    {
      id: 'r2',
      authorId: 'author2',
      authorName: 'Sarah M.',
      reviewedId: '1',
      content: 'Solid drummer, super easy to work with.',
      rating: 4.5,
    },
  ],
};

const mockPosts: Post[] = [
  { id: '1', userId: '1', type: 'video', uri: 'https://example.com/video1.mp4', createdAt: '2024-06-01' },
  { id: '2', userId: '1', type: 'audio', uri: 'https://example.com/audio1.mp3', createdAt: '2024-06-05' },
  { id: '3', userId: '1', type: 'video', uri: 'https://example.com/video2.mp4', createdAt: '2024-06-07' },
];

export default function ProfileScreen() {
  const { isAuthenticated } = useProtectedRoute();
  return (
    // This is all provvisionary data, replace with real user and posts data
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image source={{ uri: mockUser.profilePicture }} style={styles.avatar} />
        <Text style={styles.name}>{mockUser.name}</Text>
        <Text style={styles.username}>@{mockUser.username}</Text>
        <Text style={styles.instrument}>{mockUser.playedInstruments![0]}</Text>
        {mockUser.bio && <Text style={styles.bio}>{mockUser.bio}</Text>}
        {mockUser.rating && <Text style={styles.rating}>⭐ {mockUser.rating.toFixed(1)}</Text>}
      </View>

      {/* Media Posts */}
      <Text style={styles.sectionTitle}>Performances</Text>
      <FlatList
        data={mockPosts}
        renderItem={({ item }) => <PostCard post={item} />}
        keyExtractor={(item) => item.id}
        numColumns={3}
        scrollEnabled={false}
      />

      {/* Reviews Preview */}
      <View style={styles.reviewSection}>
        <Text style={styles.sectionTitle}>Reviews</Text>
        {mockUser.reviews?.slice(0, 2).map((review: Review) => (
          <View key={review.id} style={styles.reviewCard}>
            <Text style={styles.reviewAuthor}>{review.authorName}</Text>
            <Text style={styles.reviewText}>{review.content}</Text>
            <Text style={styles.reviewRating}>⭐ {review.rating}</Text>
          </View>
        ))}
        <Link href="/(tabs)/profile/reviews" asChild>
          <TouchableOpacity>
            <Text style={styles.link}>View all reviews</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  username: {
    color: '#666',
  },
  instrument: {
    fontSize: 16,
    marginTop: 4,
  },
  bio: {
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  rating: {
    fontSize: 16,
    color: '#f5a623',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  reviewSection: {
    marginTop: 12,
  },
  reviewCard: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  reviewAuthor: {
    fontWeight: 'bold',
  },
  reviewText: {
    marginTop: 4,
    marginBottom: 4,
  },
  reviewRating: {
    color: '#f5a623',
  },
  link: {
    color: '#007AFF',
    textAlign: 'right',
    marginTop: 8,
  },
});
