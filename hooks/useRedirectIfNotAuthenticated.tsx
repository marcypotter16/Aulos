import { useRouter } from "expo-router";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { useAuth } from "./AuthContext";

export function useRedirectIfUnauthenticated(redirectTo: string = "/login") {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      Toast.show({
        type: "error",
        text1: "Unauthorized",
        text2: "Please log in first.",
      });
      router.replace(redirectTo as any);
    }
  }, [isAuthenticated, isLoading]);

  return { isLoading };
}