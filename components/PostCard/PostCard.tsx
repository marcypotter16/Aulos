import { darkThemeColors, lightThemeColors } from '@/constants';
import { useAudioPlayerForMedia, useVideoPlayerForMedia } from '@/hooks/AVHooks';
import { useTheme } from '@/hooks/ThemeContext';
import Post from '@/models/post';
import { Ionicons } from '@expo/vector-icons';
import { VideoView } from 'expo-video';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

const AUDIO_PLACEHOLDER = require('../../assets/images/audio-placeholder-thumbnail.jpg');


type Props = {
  post: Post;
  isVisible: boolean;
};

type PostMedia = NonNullable<Post[ 'post_media' ]>[ number ];

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive sizing based on screen size
const isTablet = screenWidth >= 768;
const isLargeScreen = screenWidth >= 1024;

// Calculate responsive dimensions
const getMediaDimensions = () => {
  const baseWidth = screenWidth - 64; // Account for card margins (32 * 2)
  const maxWidth = isLargeScreen ? 600 : isTablet ? 500 : 300;
  const mediaWidth = Math.min(baseWidth, maxWidth);

  // Aspect ratio for media (16:9 for video, adjustable for images)
  const mediaHeight = isTablet ? mediaWidth * 0.6 : mediaWidth * 0.6;

  return { width: mediaWidth, height: mediaHeight };
};

const getPostCardHeight = () => {
  if (isLargeScreen) return screenHeight * 0.7; // 70% of screen height
  if (isTablet) return screenHeight * 0.6; // 60% of screen height
  return 'auto'; // Auto height for mobile
};

const PostCard = ({ post, isVisible }: Props) => {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const [ activeIndex, setActiveIndex ] = useState(0);
  const [ isTransitioning, setIsTransitioning ] = useState(false);
  const flatListRef = useRef<FlatList<PostMedia>>(null);
  const playersRef = useRef<{ video: Record<string, any>, audio: Record<string, any> }>({ video: {}, audio: {} });

  // Control playback based on visibility and active media (videos only - audio is manual)
  // Note: With thumbnails, auto-play is now disabled. Users click to play videos.
  useEffect(() => {
    // Videos now use manual play via thumbnails
    // This effect could be used for auto-pause when scrolling away
    post.post_media?.forEach((media, idx) => {
      const videoPlayer = playersRef.current.video[ media.id ];

      if (media.type === 'video' && videoPlayer) {
        // Only pause videos when not visible (don't auto-play)
        if (!(idx === activeIndex && isVisible)) {
          try {
            videoPlayer.pause();
          } catch (error) {
            console.warn('Failed to pause video:', error);
          }
        }
      }
    });
  }, [ isVisible, activeIndex, post.post_media ]);

  const onViewRef = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[ 0 ].index ?? 0;
      setActiveIndex(index);
    }
  });

  const handleNext = () => {
    if (!post.post_media || isTransitioning) return;
    const nextIndex = Math.min(activeIndex + 1, post.post_media.length - 1);
    if (nextIndex !== activeIndex) {
      if (Platform.OS === 'web') {
        setIsTransitioning(true);
        setTimeout(() => {
          setActiveIndex(nextIndex);
          setTimeout(() => setIsTransitioning(false), 50);
        }, 150);
      } else {
        setActiveIndex(nextIndex);
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      }
    }
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    const prevIndex = Math.max(activeIndex - 1, 0);
    if (prevIndex !== activeIndex) {
      if (Platform.OS === 'web') {
        setIsTransitioning(true);
        setTimeout(() => {
          setActiveIndex(prevIndex);
          setTimeout(() => setIsTransitioning(false), 50);
        }, 150);
      } else {
        setActiveIndex(prevIndex);
        flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
      }
    }
  };

  const goToIndex = (index: number) => {
    if (index >= 0 && index < (post.post_media?.length || 0) && !isTransitioning) {
      if (Platform.OS === 'web') {
        setIsTransitioning(true);
        setTimeout(() => {
          setActiveIndex(index);
          setTimeout(() => setIsTransitioning(false), 50);
        }, 150);
      } else {
        setActiveIndex(index);
        flatListRef.current?.scrollToIndex({ index, animated: true });
      }
    }
  };

  const MediaItem = React.memo(({ item }: { item: PostMedia }) => {
    const [ isAudioPlaying, setIsAudioPlaying ] = useState(false);
    const [ audioPlayerReady, setAudioPlayerReady ] = useState(false);
    const [ videoPlayerReady, setVideoPlayerReady ] = useState(false);
    const [ showVideoThumbnail, setShowVideoThumbnail ] = useState(true);

    // Create video player but don't rush to show it
    const videoPlayer = useVideoPlayerForMedia(item.type === 'video' ? item : null);
    // Only create audio player when user explicitly wants to play
    const audioPlayer = useAudioPlayerForMedia(item.type === 'audio' && audioPlayerReady ? item : null);

    // Generate thumbnail URL for video (memoized to prevent re-computation)
    const videoThumbnailUrl = useMemo(() => {
      if (item.type !== 'video') return '';
      // For demo purposes, use a related image. In real app, you'd have thumbnail endpoints
      if (item.url.includes('BigBuckBunny')) {
        return 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=300&fit=crop';
      }
      // Default video thumbnail
      return 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop';
    }, [item.type, item.url]);

    // Handle audio play/pause toggle (memoized to prevent re-creation)
    const handleAudioToggle = useCallback(() => {
      if (!audioPlayerReady) {
        // First time playing - create the player
        setAudioPlayerReady(true);
        setIsAudioPlaying(true);
      } else {
        // Toggle existing player
        if (audioPlayer) {
          try {
            if (isAudioPlaying) {
              audioPlayer.pause();
            } else {
              audioPlayer.play();
            }
            setIsAudioPlaying(!isAudioPlaying);
          } catch (error) {
            console.warn('Error controlling audio playback:', error);
          }
        }
      }
    }, [audioPlayerReady, audioPlayer, isAudioPlaying]);

    // Handle video thumbnail transition (memoized to prevent re-creation)
    const handleVideoThumbnailPress = useCallback(() => {
      if (item.type === 'video' && videoPlayer) {
        setShowVideoThumbnail(false);
        setVideoPlayerReady(true);
        // Small delay to ensure smooth transition
        setTimeout(() => {
          try {
            videoPlayer.play();
          } catch (error) {
            console.warn('Error starting video playback:', error);
          }
        }, 100);
      }
    }, [item.type, videoPlayer]);

    // Store players in ref for playback control
    useEffect(() => {
      if (videoPlayer) {
        playersRef.current.video[ item.id ] = videoPlayer;
      }
      if (audioPlayer) {
        playersRef.current.audio[ item.id ] = audioPlayer;
        // Auto-play when audio player is first created
        if (audioPlayerReady && isAudioPlaying) {
          try {
            audioPlayer.play();
          } catch (error) {
            console.warn('Error starting audio playback:', error);
          }
        }
      }

      return () => {
        // Cleanup when component unmounts
        if (playersRef.current.video[ item.id ]) {
          delete playersRef.current.video[ item.id ];
        }
        if (playersRef.current.audio[ item.id ]) {
          delete playersRef.current.audio[ item.id ];
        }
      };
    }, [ videoPlayer, audioPlayer, item.id, audioPlayerReady, isAudioPlaying ]);

    return (
      <View style={Platform.OS === 'web' ? styles.singleMediaWrapper : styles.mediaWrapper}>
        {item.type === 'image' && (
          <Image source={{ uri: item.url }} style={styles.postImage} />
        )}
        {item.type === 'video' && (
          <>
            {showVideoThumbnail ? (
              // Video thumbnail with play button overlay
              <TouchableOpacity onPress={handleVideoThumbnailPress} style={styles.videoThumbnailContainer}>
                <Image
                  source={{ uri: videoThumbnailUrl }}
                  style={styles.postImage}
                  resizeMode="cover"
                />
                {/* Play button overlay */}
                <View style={styles.videoPlayOverlay}>
                  <Ionicons
                    name="play-circle"
                    size={isTablet ? 80 : 64}
                    color="rgba(255, 255, 255, 0.9)"
                  />
                </View>
                {/* Video duration badge (optional) */}
                <View style={styles.videoDurationBadge}>
                  <Text style={styles.videoDurationText}>Video</Text>
                </View>
              </TouchableOpacity>
            ) : (
              // Actual video player
              videoPlayer && (
                <VideoView
                  style={styles.postImage}
                  player={videoPlayer}
                  allowsFullscreen
                  allowsPictureInPicture
                  nativeControls={false}
                />
              )
            )}
          </>
        )}
        {item.type === 'audio' && (
          <View style={styles.audioContainer}>
            <Image
              source={AUDIO_PLACEHOLDER}
              style={[ styles.postImage, { opacity: 0.3 } ]}
              resizeMode="contain"
            />
            {/* Play/Pause Button Overlay */}
            <TouchableOpacity
              style={styles.audioPlayButton}
              onPress={handleAudioToggle}
            >
              <Ionicons
                name={isAudioPlaying ? "pause" : "play"}
                size={isTablet ? 60 : 48}
                color="#FFFFFF"
              />
            </TouchableOpacity>
            {/* Audio progress indicator */}
            {audioPlayerReady && (
              <View style={styles.audioStatus}>
                <Text style={styles.audioStatusText}>
                  {isAudioPlaying ? "Playing..." : "Paused"}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  });

  const renderMediaItem = useCallback(({ item }: { item: PostMedia }) => (
    <MediaItem item={item} />
  ), []);

  const getItemLayout = useCallback((data: any, index: number) => {
    const mediaDimensions = getMediaDimensions();
    const itemWidth = mediaDimensions.width + 16; // Media width + margin
    return {
      length: itemWidth,
      offset: itemWidth * index,
      index,
    };
  }, []);

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
          {Platform.OS === 'web' ? (
            // Single media display for web with swipe animation
            <View style={styles.singleMediaContainer}>
              <View style={[
                styles.mediaSlideContainer,
                isTransitioning && styles.mediaSlideTransition
              ]}>
                <MediaItem item={post.post_media[ activeIndex ]} />
              </View>
            </View>
          ) : (
            // FlatList for mobile platforms  
            <FlatList
              ref={flatListRef}
              data={post.post_media}
              keyExtractor={(item) => item.id}
              renderItem={renderMediaItem}
              getItemLayout={getItemLayout}
              horizontal
              pagingEnabled={true}
              showsHorizontalScrollIndicator={false}
              onViewableItemsChanged={onViewRef.current}
              viewabilityConfig={{ itemVisiblePercentThreshold: 90 }}
              snapToInterval={getMediaDimensions().width + 16} // Media width + margin
              snapToAlignment="start"
              decelerationRate="fast"
              removeClippedSubviews
              initialNumToRender={3}
              maxToRenderPerBatch={3}
              windowSize={5}
            />
          )}

          {post.post_media && post.post_media.length > 1 && (
            <>
              {/* Media indicators (dots) */}
              <View style={styles.mediaIndicators}>
                {post.post_media.map((_, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.indicator,
                      index === activeIndex && styles.activeIndicator
                    ]}
                    onPress={() => goToIndex(index)}
                  />
                ))}
              </View>

              {/* Navigation arrows for web */}
              {Platform.OS === 'web' && (
                <View style={styles.webNavigation}>
                  <TouchableOpacity
                    onPress={handlePrev}
                    disabled={activeIndex === 0}
                    style={[
                      styles.navButton,
                      activeIndex === 0 && styles.navButtonDisabled
                    ]}
                  >
                    <Text style={[
                      styles.navButtonText,
                      activeIndex === 0 && styles.navButtonTextDisabled
                    ]}>‹</Text>
                  </TouchableOpacity>

                  <Text style={styles.mediaCounter}>
                    {activeIndex + 1} / {post.post_media.length}
                  </Text>

                  <TouchableOpacity
                    onPress={handleNext}
                    disabled={activeIndex === post.post_media.length - 1}
                    style={[
                      styles.navButton,
                      activeIndex === post.post_media.length - 1 && styles.navButtonDisabled
                    ]}
                  >
                    <Text style={[
                      styles.navButtonText,
                      activeIndex === post.post_media.length - 1 && styles.navButtonTextDisabled
                    ]}>›</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
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

const getStyles = (theme: 'light' | 'dark') => {
  const mediaDimensions = getMediaDimensions();
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
    postImage: {
      width: mediaDimensions.width,
      height: mediaDimensions.height,
      borderRadius: 10,
      marginTop: 8,
    },
    mediaWrapper: {
      marginRight: 8,
      width: mediaDimensions.width + 8, // Add padding for proper spacing
      alignItems: 'center',
    },
    singleMediaContainer: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    mediaSlideContainer: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      transform: [{ translateX: 0 }],
      ...(Platform.OS === 'web' && {
        transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }),
    },
    mediaSlideTransition: {
      ...(Platform.OS === 'web' && {
        transform: [{ translateX: 20 }],
        opacity: 0.7,
      }),
    },
    singleMediaWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    preloadedItem: {
      position: 'absolute',
      opacity: 0,
      pointerEvents: 'none',
      zIndex: -1,
    },
    mediaPlaceholder: {
      backgroundColor: theme === 'dark' ? darkThemeColors.secondary : lightThemeColors.secondary,
      justifyContent: 'center',
      alignItems: 'center',
      opacity: 0.7,
    },
    placeholderText: {
      color: theme === 'dark' ? darkThemeColors.text : lightThemeColors.text,
      fontSize: 16,
      fontWeight: '500',
    },
    audio: {
      width: Math.min(mediaDimensions.width * 0.8, 300),
      height: isTablet ? 60 : 50,
      marginTop: 8,
    },
    audioContainer: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
    },
    audioPlayButton: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: [ { translateX: -(isTablet ? 30 : 24) }, { translateY: -(isTablet ? 30 : 24) } ],
      width: isTablet ? 80 : 64,
      height: isTablet ? 80 : 64,
      borderRadius: isTablet ? 40 : 32,
      backgroundColor: theme === 'dark' ? darkThemeColors.primary : lightThemeColors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 6,
    },
    audioStatus: {
      position: 'absolute',
      bottom: 20,
      backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    audioStatusText: {
      color: theme === 'dark' ? darkThemeColors.text : lightThemeColors.text,
      fontSize: isTablet ? 14 : 12,
      fontWeight: '500',
    },
    videoThumbnailContainer: {
      position: 'relative',
    },
    videoPlayOverlay: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: [ { translateX: -(isTablet ? 40 : 32) }, { translateY: -(isTablet ? 40 : 32) } ],
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    videoDurationBadge: {
      position: 'absolute',
      top: 12,
      right: 12,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
    },
    videoDurationText: {
      color: '#FFFFFF',
      fontSize: isTablet ? 12 : 10,
      fontWeight: '600',
    },
    actions: {
      flexDirection: 'row',
      marginTop: isTablet ? 16 : 10,
      justifyContent: 'space-around',
      paddingHorizontal: isTablet ? 20 : 10,
    },
    mediaIndicators: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: isTablet ? 12 : 8,
      gap: isTablet ? 8 : 6,
    },
    indicator: {
      width: isTablet ? 10 : 8,
      height: isTablet ? 10 : 8,
      borderRadius: isTablet ? 5 : 4,
      backgroundColor: theme === 'dark' ? darkThemeColors.secondary : lightThemeColors.secondary,
      opacity: 0.5,
    },
    activeIndicator: {
      backgroundColor: theme === 'dark' ? darkThemeColors.primary : lightThemeColors.primary,
      opacity: 1,
      width: isTablet ? 14 : 10,
      height: isTablet ? 14 : 10,
      borderRadius: isTablet ? 7 : 5,
    },
    webNavigation: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: isTablet ? 12 : 8,
      paddingHorizontal: isTablet ? 30 : 20,
    },
    navButton: {
      width: isTablet ? 48 : 36,
      height: isTablet ? 48 : 36,
      borderRadius: isTablet ? 24 : 18,
      backgroundColor: theme === 'dark' ? darkThemeColors.primary : lightThemeColors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    navButtonDisabled: {
      backgroundColor: theme === 'dark' ? darkThemeColors.secondary : lightThemeColors.secondary,
      opacity: 0.5,
    },
    navButtonText: {
      fontSize: isTablet ? 26 : 20,
      fontWeight: 'bold',
      color: theme === 'dark' ? '#FFFFFF' : '#FFFFFF',
    },
    navButtonTextDisabled: {
      color: theme === 'dark' ? '#CCCCCC' : '#666666',
    },
    mediaCounter: {
      fontSize: isTablet ? 16 : 14,
      fontWeight: '500',
      color: theme === 'dark' ? darkThemeColors.text : lightThemeColors.text,
      backgroundColor: theme === 'dark' ? darkThemeColors.surface : lightThemeColors.surface,
      paddingHorizontal: isTablet ? 16 : 12,
      paddingVertical: isTablet ? 6 : 4,
      borderRadius: isTablet ? 16 : 12,
      overflow: 'hidden',
    },
  });
};

export default PostCard;
