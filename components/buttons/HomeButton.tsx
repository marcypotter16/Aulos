import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native";

type HomeButtonProps = {
  theme: 'light' | 'dark';
};

export default function HomeButton({ theme }: HomeButtonProps) {
  return (
    <TouchableOpacity
      onPress= {() => router.navigate('/')}
      style={{
        marginLeft: 15,
        padding: 6,
        borderRadius: 20,
        backgroundColor: theme === 'dark' ? '#333' : '#ddd',
      }}
    >
      <Ionicons
        name="home"
        size={20}
        color={theme === 'dark' ? '#facc15' : '#1e3a8a'}
      />
    </TouchableOpacity>
  );
}