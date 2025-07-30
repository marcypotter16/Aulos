// AVHooks.tsx
import { PostMedia } from '@/models/post_media';
import { AudioPlayer, useAudioPlayer as expoUseAudioPlayer } from 'expo-audio';
import { VideoPlayer, useVideoPlayer as expoUseVideoPlayer } from 'expo-video';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

// Create individual video player hook for a single media item
export const useVideoPlayerForMedia = (media: PostMedia | null): VideoPlayer | null => {
  const [ isReady, setIsReady ] = useState(false);

  const videoPlayer = expoUseVideoPlayer(
    media?.type === 'video' ? media.signed_url! : null
  );

  // Configure the player after creation with better error handling
  useEffect(() => {
    if (videoPlayer && media?.type === 'video' && !isReady) {
      // Small delay to ensure player is ready
      const timer = setTimeout(() => {
        try {
          videoPlayer.loop = true;
          videoPlayer.muted = true;
          setIsReady(true);
        } catch (error) {
          console.warn('Failed to configure video player:', error);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [ videoPlayer, media, isReady ]);

  return videoPlayer;
};

// Create individual audio player hook for a single media item
export const useAudioPlayerForMedia = (media: PostMedia | null): AudioPlayer | null => {
  const [ isReady, setIsReady ] = useState(false);

  // On web, only create audio players for the currently active item to prevent DOMException
  const shouldCreateAudioPlayer = media?.type === 'audio' &&
    (Platform.OS !== 'web' || media.signed_url !== null);

  const audioPlayer = expoUseAudioPlayer(
    shouldCreateAudioPlayer ? media.signed_url : null
  );

  // Configure the player after creation
  useEffect(() => {
    if (audioPlayer && media?.type === 'audio' && !isReady) {
      const timer = setTimeout(() => {
        try {
          audioPlayer.loop = true;
          setIsReady(true);
        } catch (error) {
          // Silently handle configuration errors
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [ audioPlayer, media, isReady ]);

  return audioPlayer;
};

// Get items to preload based on active index and window
export const getPreloadItems = (mediaItems: PostMedia[], activeIndex: number, preloadWindow: number = 1): PostMedia[] => {
  if (!mediaItems.length) return [];

  const startIndex = Math.max(0, activeIndex - preloadWindow);
  const endIndex = Math.min(mediaItems.length - 1, activeIndex + preloadWindow);

  return mediaItems.slice(startIndex, endIndex + 1);
};

// Check if an item should be preloaded (with web-specific audio handling)
export const shouldPreloadItem = (item: PostMedia, mediaItems: PostMedia[], activeIndex: number, preloadWindow: number = 1): boolean => {
  const preloadItems = getPreloadItems(mediaItems, activeIndex, preloadWindow);
  const isInPreloadRange = preloadItems.some(preloadItem => preloadItem.id === item.id);

  // On web, only load audio for the currently active item to prevent DOMException
  if (Platform.OS === 'web' && item.type === 'audio') {
    const currentItem = mediaItems[ activeIndex ];
    return item.id === currentItem?.id;
  }

  return isInPreloadRange;
};

// Helper function to get video media items
export const getVideoMediaItems = (mediaItems: PostMedia[]): PostMedia[] => {
  return mediaItems.filter(m => m.type === 'video');
};

// Helper function to get audio media items  
export const getAudioMediaItems = (mediaItems: PostMedia[]): PostMedia[] => {
  return mediaItems.filter(m => m.type === 'audio');
};