// components/HeaderToggleButton.tsx
import { useTheme } from '@/hooks/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';

const HeaderToggleButton = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={{
        marginRight: 15,
        padding: 6,
        borderRadius: 20,
        backgroundColor: isDark ? '#333' : '#ddd',
      }}
    >
      <Ionicons
        name={isDark ? 'moon' : 'sunny'}
        size={20}
        color={isDark ? '#facc15' : '#1e3a8a'}
      />
    </TouchableOpacity>
  );
};

export default HeaderToggleButton;
