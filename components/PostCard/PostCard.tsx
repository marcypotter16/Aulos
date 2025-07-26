import { darkThemeColors, lightThemeColors } from '@/constants';
import { useTheme } from '@/hooks/ThemeContext';
import Post from '@/models/post';
import { ResizeMode, Video } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from 'react-native';
import PostActionIcon from './PostActionIcon';

type Props = {
  post: Post;
  isVisible: boolean;
};

type PostMedia = NonNullable<Post[ 'post_media' ]>[ number ];

const screenWidth = Dimensions.get('window').width;

const PostCard = ({ post, isVisible }: Props) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [ activeIndex, setActiveIndex ] = useState(0);
  const videoRefs = useRef<Record<string, any>>({});
  const flatListRef = useRef<FlatList<PostMedia>>(null);

  useEffect(() => {
    post.post_media?.forEach((media, idx) => {
      const ref = videoRefs.current[ media.id ];
      if (!ref?.current) return;

      if (isVisible && idx === activeIndex && (media.type === 'video' || media.type === 'audio')) {
        ref.current.playAsync();
      } else {
        ref.current.pauseAsync();
      }
    });
  }, [ isVisible, activeIndex ]);

  const onViewRef = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[ 0 ].index ?? 0;
      setActiveIndex(index);
    }
  });

  const handleNext = () => {
    if (!post.post_media) return;
    const nextIndex = Math.min(activeIndex + 1, post.post_media.length - 1);
    flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
  };

  const handlePrev = () => {
    const prevIndex = Math.max(activeIndex - 1, 0);
    flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
  };

  const renderMedia = ({ item }: { item: PostMedia }) => {
    const ref = React.createRef<any>();
    videoRefs.current[ item.id ] = ref;

    return (
      <View style={styles.mediaWrapper}>
        {item.type === 'image' && (
          <Image source={{ uri: item.url }} style={styles.postImage} />
        )}
        {(item.type === 'video' || item.type === 'audio') && (
          <Video
            ref={ref}
            source={{ uri: item.url }}
            resizeMode={ResizeMode.CONTAIN}
            style={item.type === 'audio' ? styles.audio : styles.postImage}
            useNativeControls={false}
            isLooping
            shouldPlay={false}
            isMuted={false}
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {post.userProfilePicture && (
          <Image source={{ uri: post.userProfilePicture }} style={styles.avatar} />
        )}
        {post.userName && <Text style={styles.name}>{post.userName}</Text>}
      </View>

      <Text style={styles.text}>{post.content}</Text>

      {post.post_media && post.post_media?.length > 0 && (
        <>
          <FlatList
            ref={flatListRef}
            data={post.post_media}
            keyExtractor={(item) => item.id}
            renderItem={renderMedia}
            horizontal
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewRef.current}
            viewabilityConfig={{ itemVisiblePercentThreshold: 80 }}
          />

          {Platform.OS === 'web' && post.post_media && post.post_media.length > 1 && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
              <TouchableOpacity onPress={handlePrev} disabled={activeIndex === 0}>
                <Text style={{ fontSize: 24 }}>{'‹'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleNext}
                disabled={activeIndex === post.post_media.length - 1}
              >
                <Text style={{ fontSize: 24 }}>{'›'}</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

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

const getStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    card: {
      backgroundColor: theme === 'dark' ? darkThemeColors.surface : lightThemeColors.surface,
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
      color: theme === 'dark' ? darkThemeColors.text : lightThemeColors.text,
    },
    text: {
      fontSize: 15,
      marginVertical: 8,
      color: theme === 'dark' ? darkThemeColors.text : lightThemeColors.text,
    },
    postImage: {
      width: 300,
      height: 180,
      borderRadius: 10,
      marginTop: 8,
    },
    mediaWrapper: {
      marginRight: 8,
    },
    audio: {
      width: 250,
      height: 50,
      marginTop: 8,
    },
    actions: {
      flexDirection: 'row',
      marginTop: 10,
      justifyContent: 'space-around',
    },
  });

export default PostCard;
