import { useTheme } from '@/hooks/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';

export default function HeaderRightButtons() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

  return (
    <View style={{ flexDirection: 'row', gap: 8, marginRight: 8 }}>
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
        <TouchableOpacity
            onPress={() => router.push('/profile')}
            style={{
              marginRight: 15,
              padding: 6,
              borderRadius: 20,
              backgroundColor: isDark ? '#333' : '#ddd',
            }}
          >
            <Ionicons name='person-circle-outline' size={20} color={isDark ? '#facc15' : '#1e3a8a'} />
        </TouchableOpacity>
    </View>
  );
}
