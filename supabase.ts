import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import Toast from 'react-native-toast-message';

const supabaseUrl = Constants.expoConfig!.extra!.supabaseUrl
const supabaseAnonKey = Constants.expoConfig!.extra!.supabaseAnonKey

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadProfilePic(file: Blob, userId: string): Promise<string> {
    console.log('Supabase URL:', supabaseUrl);
    const filePath = `user_${userId}.jpg`;

    const { data: uploadData, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
        });

    if (error) {
        Toast.show({
            type: 'error',
            text1: 'Error uploading profile picture:',
            text2: error.message,
        });
        throw error;
    }

    const response = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

    return response.data.publicUrl;
}