import { useVideoPlayerForMedia } from '@/hooks/AVHooks';
import { PostMedia } from '@/models/post_media';
import { Ionicons } from '@expo/vector-icons';
import { VideoView } from 'expo-video';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Props = {
  media: PostMedia;
  style?: any;
};

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

const VideoRenderer = ({ media, style }: Props) => {
  const [showThumbnail, setShowThumbnail] = useState(true);
  
  const videoPlayer = useVideoPlayerForMedia(media);

  // Generate thumbnail URL for video
  const getThumbnailUrl = () => {
    return 'https://picsum.photos/400/300?random=' + Math.floor(Math.random() * 1000);
  };

  const handleThumbnailPress = () => {
    if (videoPlayer) {
      console.log('Thumbnail pressed, video player state:', {
        muted: videoPlayer.muted,
        volume: videoPlayer.volume,
        status: videoPlayer.status
      });
      
      setShowThumbnail(false);
      setTimeout(() => {
        try {
          videoPlayer.play();
          console.log('Video play called, new state:', {
            muted: videoPlayer.muted,
            volume: videoPlayer.volume
          });
        } catch (error) {
          console.warn('Error starting video playback:', error);
        }
      }, 100);
    }
  };

  return (
    <View style={[style]}>
      {showThumbnail ? (
        <TouchableOpacity onPress={handleThumbnailPress} style={styles.thumbnailContainer}>
          <Image
            source={{ uri: getThumbnailUrl() }}
            style={styles.thumbnailImage}
            resizeMode="cover"
          />
          
          <View style={styles.playOverlay}>
            <Ionicons
              name="play-circle"
              size={isTablet ? 80 : 64}
              color="rgba(255, 255, 255, 0.9)"
            />
          </View>
          
          <View style={[styles.videoBadge, getVideoBadgeStyle()]}>
            <Text style={styles.videoBadgeText}>Video</Text>
          </View>
        </TouchableOpacity>
      ) : (
        videoPlayer && (
          <VideoView
            style={styles.videoPlayer}
            player={videoPlayer}
            allowsFullscreen
            allowsPictureInPicture
            nativeControls={true}
            crossOrigin='anonymous'
          />
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 16/9, // Force a proper aspect ratio
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  videoBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  videoBadgeText: {
    color: '#FFFFFF',
    fontSize: isTablet ? 12 : 10,
    fontWeight: '600',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});

const getVideoBadgeStyle = () => ({
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
});

export default VideoRenderer;