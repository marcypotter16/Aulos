import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';

type Props = {
  name: keyof typeof Ionicons.glyphMap; // ensures only valid Ionicon names
  onPress?: () => void;
  size?: number;
  color?: string;
};

const PostActionIcon = ({ name, onPress, size = 22, color = '#000' }: Props) => {
    return (
        <TouchableOpacity onPress={onPress} style={{ padding: 4 }}>
            <Ionicons name={name} size={size} color={color} />
        </TouchableOpacity>
    );
};

export default PostActionIcon;
