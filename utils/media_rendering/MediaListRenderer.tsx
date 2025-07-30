import { darkThemeColors, DEFAULT_SIGNED_URL_EXPIRATION, lightThemeColors } from '@/constants';
import { useTheme } from '@/hooks/ThemeContext';
import { PostMedia } from '@/models/post_media';
import { supabase } from '@/supabase';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from 'react-native';
import AudioRenderer from './AudioRenderer';
import ImageRenderer from './ImageRenderer';
import VideoRenderer from './VideoRenderer';

type Props = {
  post_medias: PostMedia[];
  isVisible: boolean;
  preSignedUrls?: string[];
};

const { width: screenWidth } = Dimensions.get('window');

const isTablet = screenWidth >= 768;
const isLargeScreen = screenWidth >= 1024;

const getMediaDimensions = () => {
  const baseWidth = screenWidth - 64;
  const maxWidth = isLargeScreen ? 600 : isTablet ? 500 : 300;
  const mediaWidth = Math.min(baseWidth, maxWidth);
  const mediaHeight = isTablet ? mediaWidth * 0.6 : mediaWidth * 0.6;

  return { width: mediaWidth, height: mediaHeight };
};

const MediaListRenderer = ({ post_medias, isVisible, preSignedUrls }: Props) => {
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [signedPostMedias, setSignedPostMedias] = useState<PostMedia[]>([]);
  const flatListRef = useRef<FlatList<PostMedia>>(null);

  // Setup signed URLs
  useEffect(() => {
    const setupSignedURLs = async () => {
      if (preSignedUrls && preSignedUrls.length === post_medias.length) {
        const nowSignedPostMedias = post_medias.map((pm: PostMedia, idx: number) => ({
          ...pm,
          signed_url: preSignedUrls[idx]
        }));
        setSignedPostMedias(nowSignedPostMedias);
      } else if (post_medias.every(media => media.signed_url)) {
        setSignedPostMedias(post_medias);
      } else {
        const paths = post_medias.map((media: PostMedia) => media.media_path);
        const { data: signedURLs } = await supabase
          .storage
          .from("post-media-bucket")
          .createSignedUrls(paths, DEFAULT_SIGNED_URL_EXPIRATION);
        
        if (signedURLs && !signedURLs.some(item => item.error)) {
          const signedPaths = signedURLs.map(item => item.signedUrl);
          const nowSignedPostMedias = post_medias.map((pm: PostMedia, idx: number) => ({
            ...pm,
            signed_url: signedPaths[idx]
          }));
          setSignedPostMedias(nowSignedPostMedias);
        }
      }
    };

    setupSignedURLs();
  }, [preSignedUrls, post_medias]);

  const onViewRef = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index ?? 0;
      setActiveIndex(index);
    }
  });

  const handleNext = () => {
    if (!post_medias || isTransitioning) return;
    const nextIndex = Math.min(activeIndex + 1, post_medias.length - 1);
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
    if (index >= 0 && index < (post_medias?.length || 0) && !isTransitioning) {
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

  const MediaItem = ({ item, itemIndex }: { item: PostMedia; itemIndex: number }) => {
    const mediaDimensions = getMediaDimensions();
    const mediaStyle = {
      width: mediaDimensions.width,
      height: mediaDimensions.height,
    };

    // Audio is only visible if this is the active item and the overall component is visible
    const audioVisible = isVisible && itemIndex === activeIndex;

    return (
      <View style={Platform.OS === 'web' ? styles.singleMediaWrapper : styles.mediaWrapper}>
        {item.type === 'image' && (
          <ImageRenderer media={item} style={mediaStyle} />
        )}
        {item.type === 'video' && (
          <VideoRenderer media={item} style={mediaStyle} />
        )}
        {item.type === 'audio' && (
          <AudioRenderer media={item} style={mediaStyle} isVisible={audioVisible} />
        )}
      </View>
    );
  };

  const renderMediaItem = ({ item, index }: { item: PostMedia; index: number }) => (
    <MediaItem item={item} itemIndex={index} />
  );

  const getItemLayout = (_data: any, index: number) => {
    const mediaDimensions = getMediaDimensions();
    const itemWidth = mediaDimensions.width + 16;
    return {
      length: itemWidth,
      offset: itemWidth * index,
      index,
    };
  };

  const styles = getStyles(theme);

  return (
    <View>
      {signedPostMedias && signedPostMedias.length > 0 && (
        <>
          {Platform.OS === 'web' ? (
            <View style={styles.singleMediaContainer}>
              <View style={[
                styles.mediaSlideContainer,
                isTransitioning && styles.mediaSlideTransition
              ]}>
                <MediaItem item={signedPostMedias[activeIndex]} itemIndex={activeIndex} />
              </View>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={signedPostMedias}
              keyExtractor={(item) => item.id}
              renderItem={renderMediaItem}
              getItemLayout={getItemLayout}
              horizontal
              pagingEnabled={true}
              showsHorizontalScrollIndicator={false}
              onViewableItemsChanged={onViewRef.current}
              viewabilityConfig={{ itemVisiblePercentThreshold: 90 }}
              snapToInterval={getMediaDimensions().width + 16}
              snapToAlignment="start"
              decelerationRate="fast"
              removeClippedSubviews
              initialNumToRender={3}
              maxToRenderPerBatch={3}
              windowSize={5}
            />
          )}

          {signedPostMedias.length > 1 && (
            <>
              <View style={styles.mediaIndicators}>
                {signedPostMedias.map((_, index) => (
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
                    {activeIndex + 1} / {signedPostMedias.length}
                  </Text>

                  <TouchableOpacity
                    onPress={handleNext}
                    disabled={activeIndex === signedPostMedias.length - 1}
                    style={[
                      styles.navButton,
                      activeIndex === post_medias.length - 1 && styles.navButtonDisabled
                    ]}
                  >
                    <Text style={[
                      styles.navButtonText,
                      activeIndex === post_medias.length - 1 && styles.navButtonTextDisabled
                    ]}>›</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </>
      )}
    </View>
  );
};

const getStyles = (theme: 'light' | 'dark') => {
  const mediaDimensions = getMediaDimensions();

  return StyleSheet.create({
    mediaWrapper: {
      marginRight: 8,
      width: mediaDimensions.width + 8,
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
      color: '#FFFFFF',
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

export default MediaListRenderer;