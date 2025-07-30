import { PostMedia } from '@/models/post_media';
import React from 'react';
import { Image, StyleSheet } from 'react-native';

type Props = {
  media: PostMedia;
  style?: any;
};

const ImageRenderer = ({ media, style }: Props) => {
  return (
    <Image
      source={
        media.signed_url && media.signed_url.trim() !== ''
          ? { uri: media.signed_url }
          : undefined
      }
      style={[styles.image, style]}
      resizeMode="cover"
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});

export default ImageRenderer;