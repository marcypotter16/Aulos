import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export function useAuthGuard(redirectTo: string = '/login') {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await SecureStore.getItemAsync('access_token');

      if (!token) {
        Alert.alert('Unauthorized', 'Please log in first.');
        router.replace(redirectTo as any); // push or replace depending on your flow
        return;
      }

      // Optional: validate token with backend
      try {
        const res = await fetch('http://127.0.0.1/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Invalid or expired token');

        setIsAuthenticated(true);
      } catch (err) {
        await SecureStore.deleteItemAsync('access_token');
        Alert.alert('Session expired', 'Please log in again.');
        router.replace(redirectTo as any);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isLoading, isAuthenticated };
}
