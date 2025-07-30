import { darkThemeColors, lightThemeColors } from '@/constants';
import { useAudioPlayerForMedia } from '@/hooks/AVHooks';
import { useTheme } from '@/hooks/ThemeContext';
import { PostMedia } from '@/models/post_media';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const AUDIO_PLACEHOLDER = require('../../assets/images/audio-placeholder-thumbnail.jpg');

type Props = {
  media: PostMedia;
  style?: any;
  isVisible?: boolean;
};

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

const AudioRenderer = ({ media, style, isVisible = true }: Props) => {
  const { theme } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  
  // Only create audio player when user wants to play
  const audioPlayer = useAudioPlayerForMedia(playerReady ? media : null);

  const handlePlayToggle = () => {
    if (!playerReady) {
      // Initialize player on first play
      setPlayerReady(true);
      return;
    }

    if (audioPlayer) {
      try {
        if (isPlaying) {
          audioPlayer.pause();
          setIsPlaying(false);
        } else {
          audioPlayer.play();
          setIsPlaying(true);
        }
      } catch (error) {
        console.warn('Error controlling audio playback:', error);
      }
    }
  };

  // Handle visibility changes - pause when not visible
  useEffect(() => {
    if (audioPlayer && playerReady) {
      if (!isVisible && isPlaying) {
        try {
          audioPlayer.pause();
          setIsPlaying(false);
        } catch (error) {
          console.warn('Error pausing audio when not visible:', error);
        }
      }
    }
  }, [isVisible, audioPlayer, playerReady, isPlaying]);

  // Auto-play when player is first created
  useEffect(() => {
    if (audioPlayer && playerReady && !isPlaying && isVisible) {
      try {
        audioPlayer.play();
        setIsPlaying(true);
      } catch (error) {
        console.warn('Error auto-playing audio:', error);
      }
    }
  }, [audioPlayer, playerReady, isVisible]);

  // Cleanup when component unmounts or player changes
  useEffect(() => {
    return () => {
      if (audioPlayer) {
        try {
          audioPlayer.pause();
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    };
  }, [audioPlayer]);

  return (
    <View style={[styles.audioContainer, style]}>
      <Image
        source={AUDIO_PLACEHOLDER}
        style={[styles.audioImage, { opacity: 0.3 }]}
        resizeMode="contain"
      />
      
      <TouchableOpacity
        style={[styles.playButton, getPlayButtonStyle(theme)]}
        onPress={handlePlayToggle}
      >
        <Ionicons
          name={isPlaying ? "pause" : "play"}
          size={isTablet ? 60 : 48}
          color="#FFFFFF"
        />
      </TouchableOpacity>
      
      {playerReady && (
        <View style={[styles.statusContainer, getStatusStyle(theme)]}>
          <Text style={[styles.statusText, getStatusTextStyle(theme)]}>
            {isPlaying ? "Playing..." : "Paused"}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  audioContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  playButton: {
    position: 'absolute',
    width: isTablet ? 80 : 64,
    height: isTablet ? 80 : 64,
    borderRadius: isTablet ? 40 : 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  statusContainer: {
    position: 'absolute',
    bottom: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: isTablet ? 14 : 12,
    fontWeight: '500',
  },
});

const getPlayButtonStyle = (theme: 'light' | 'dark') => ({
  backgroundColor: theme === 'dark' ? darkThemeColors.primary : lightThemeColors.primary,
});

const getStatusStyle = (theme: 'light' | 'dark') => ({
  backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)',
});

const getStatusTextStyle = (theme: 'light' | 'dark') => ({
  color: theme === 'dark' ? darkThemeColors.text : lightThemeColors.text,
});

export default AudioRenderer;