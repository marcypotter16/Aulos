// Description: A reusable React Native component to display a post card with user information, text, and optional image and actions.

import Post from '@/models/post';
import React from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  post: Post;
};


const PostCard = ({ post }: Props) => {
  const [showLikeTooltip, setLikeTooltip] = React.useState(false);
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: post.userProfilePicture }} style={styles.avatar} />
        <Text style={styles.name}>{post.userName}</Text>
      </View>
      <Text style={styles.text}>{post.text}</Text>
      {post.image ? <Image source={{ uri: post.image }} style={styles.postImage} /> : null}
      {post.showActions && (
        <View style={styles.actions}>
          <Pressable 
            onPress={() => console.log("Liked!")}
            onHoverIn={() => setLikeTooltip(true)}
            onHoverOut={() => setLikeTooltip(false)}>
              <Text style={styles.action}>🎵</Text>
          </Pressable>
          {showLikeTooltip && Platform.OS === 'web' && (
          <View style={styles.tooltip}>
            <Text style={styles.tooltipText}>Like</Text>
          </View>
        )}
          <TouchableOpacity><Text style={styles.action}>💬</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.action}>📩</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.action}>🔗</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.action}>💾</Text></TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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

export default PostCard;
