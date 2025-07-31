import { useTheme } from "@/hooks/ThemeContext";
import { supabase } from "@/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";

export default function LogoutButton() {
  const { theme, colorScheme } = useTheme()

  const router = useRouter();
  const [ isLoggingOut, setIsLoggingOut ] = useState(false);


  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      Toast.show({
        type: "success",
        text1: "Logged out",
      });

      router.replace("/login");
    } catch (error: any) {
      console.error("Logout failed:", error);
      Toast.show({
        type: "error",
        text1: "Logout Failed",
        text2: error.message || "Something went wrong.",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleLogout}
      disabled={isLoggingOut}
      style={{ padding: 8 }}
    >
      {isLoggingOut ? (
        <ActivityIndicator size="small" />
      ) : (
        <Ionicons name="log-out-outline" size={30} color={colorScheme.text} />
      )}
    </TouchableOpacity>
  );
}
