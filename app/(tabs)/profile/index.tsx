import { uploadProfilePic } from "@/app/utils/SupabaseClient";
import PostCard from "@/components/PostCard/PostCard";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import Post from "@/models/post";
import User from "@/models/user";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const mockUser: User = {
  id: "1",
  name: "Alex Drummer",
  username: "alex.drummer",
  email: "",
  password: "",
  createdAt: Date.now(),
  profilePicture: "https://placehold.co/100x100",
  playedInstruments: ["Drums"],
  bio: "Session drummer | Jazz & Funk | Available for gigs",
  rating: 4.8,
  reviews: [
    {
      id: "r1",
      authorId: "author1",
      authorName: "John D.",
      reviewedId: "1",
      content: "Amazing timing and great energy live!",
      rating: 5,
    },
    {
      id: "r2",
      authorId: "author2",
      authorName: "Sarah M.",
      reviewedId: "1",
      content: "Solid drummer, super easy to work with.",
      rating: 4.5,
    },
  ],
};


const mockPosts: Post[] = [
  {
    id: "1",
    userId: "1",
    type: "video",
    uri: "https://example.com/video1.mp4",
    createdAt: "2024-06-01",
  },
  {
    id: "2",
    userId: "1",
    type: "audio",
    uri: "https://example.com/audio1.mp3",
    createdAt: "2024-06-05",
  },
  {
    id: "3",
    userId: "1",
    type: "video",
    uri: "https://example.com/video2.mp4",
    createdAt: "2024-06-07",
  },
];

export default function ProfileScreen() {
  const { isAuthenticated, user } = useProtectedRoute();
  const [showZoomedAvatar, setShowZoomedAvatar] = useState(false);

  const handlePickImage = async () => {
      console.log("Picking Image...")
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        base64: false,
        quality: 0.8,
      });

      console.log(result)
  
      if (!result.canceled) {
        console.log("Image picked: " + result)
        const uri = result.assets[0].uri;
        const response = await fetch(uri);
        const blob = await response.blob();
        const url = await uploadProfilePic(blob, user!.id!.toString());
        // Reload page
        router.replace("/(tabs)/profile");
      }
      else {
        Toast.show({
          type: "info",
          text1: "Image picking canceled"
        })
        console.log("Image picking canceled")
      }
    };

  return (
    // This is all provvisionary data, replace with real user and posts data
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setShowZoomedAvatar(true)}
          style={styles.avatarContainer}
        >
          <Image
            source={
              user?.avatar_url
                ? { uri: user.avatar_url }
                : require("../../../assets/images/default-profile.jpg")
            }
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.plusButton} onPress={handlePickImage}>
            <Ionicons name="add-circle" size={24} color="#007AFF" />
          </TouchableOpacity>
        </TouchableOpacity>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.username}>@{user?.user_name}</Text>
        <Text style={styles.instrument}>{user?.instrument}</Text>
        {/* {user.bio && <Text style={styles.bio}>{user?.bio}</Text>} */}
        {/* {user.rating && <Text style={styles.rating}>⭐ {user.rating.toFixed(1)}</Text>} */}
        {/* Zoom Modal */}
        <Modal visible={showZoomedAvatar} transparent={true} animationType="fade">
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setShowZoomedAvatar(false)}
          >
            <Image
              source={
                user?.avatar_url
                  ? { uri: user.avatar_url }
                  : require("../../../assets/images/default-profile.jpg")
              }
              style={styles.zoomedImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </Modal>
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
        {/* {user.reviews?.slice(0, 2).map((review: Review) => (
          <View key={review.id} style={styles.reviewCard}>
            <Text style={styles.reviewAuthor}>{review.authorName}</Text>
            <Text style={styles.reviewText}>{review.content}</Text>
            <Text style={styles.reviewRating}>⭐ {review.rating}</Text>
          </View>
        ))} */}
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
    alignItems: "center",
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  plusButton: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#fff",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
  },
  username: {
    color: "#666",
  },
  instrument: {
    fontSize: 16,
    marginTop: 4,
  },
  bio: {
    textAlign: "center",
    marginTop: 8,
    marginBottom: 4,
  },
  rating: {
    fontSize: 16,
    color: "#f5a623",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  reviewSection: {
    marginTop: 12,
  },
  reviewCard: {
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  reviewAuthor: {
    fontWeight: "bold",
  },
  reviewText: {
    marginTop: 4,
    marginBottom: 4,
  },
  reviewRating: {
    color: "#f5a623",
  },
  link: {
    color: "#007AFF",
    textAlign: "right",
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomedImage: {
    width: '90%',
    height: '70%',
  },
});
