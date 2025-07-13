import { StorageUtils } from '@/app/utils/StorageUtils';
import { API_URL } from '@/constants';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';

export function useProtectedRoute(redirectTo: string = '/login') {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await StorageUtils.getItem('access_token');

      if (!token) {
        Toast.show({
          type: 'error',
          text1: 'Unauthorized', 
          text2: 'Please log in first.'});
        router.replace(redirectTo as any); // push or replace depending on your flow
        return;
      }

      // Optional: validate token with backend
      try {
        console.log('Validating token with backend...');
        console.log('API URL:', API_URL);
        console.log('Token:', token);
        const res = await fetch(API_URL + '/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Invalid or expired token');

        console.log('Token is valid');
        setIsAuthenticated(true);
      } catch (err) {
        await StorageUtils.deleteItem('access_token');
        Toast.show({
          type: 'error',
          text1: 'Session expired',
          text2: 'Please log in again.',
        });
        router.replace(redirectTo as any);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isLoading, isAuthenticated };
}
