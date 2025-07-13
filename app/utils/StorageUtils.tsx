import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

export const StorageUtils = {
  async getItem(key: string): Promise<string | null> {
    return isWeb
      ? Promise.resolve(localStorage.getItem(key))
      : SecureStore.getItemAsync(key);
  },

  async setItem(key: string, value: string): Promise<void> {
    return isWeb
      ? Promise.resolve(localStorage.setItem(key, value))
      : SecureStore.setItemAsync(key, value);
  },

  async deleteItem(key: string): Promise<void> {
    return isWeb
      ? Promise.resolve(localStorage.removeItem(key))
      : SecureStore.deleteItemAsync(key);
  },
};
