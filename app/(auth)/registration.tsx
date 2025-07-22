import { darkThemeColors, lightThemeColors } from '@/constants';
import { useTheme } from '@/hooks/ThemeContext';
import { supabase } from '@/supabase';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, router } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import { UserCreate } from '../schemas/user';

const registrationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  user_name: yup.string().required('Username is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  instrument: yup.string().optional(),
  genre: yup.string().optional(),
});

const register = async (userData: UserCreate): Promise<void> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          user_name: userData.user_name,
          name: userData.name,
          instrument: userData.instrument || null,
          genre: userData.genre || null,
        },
      },
    });

    if (error) {
      throw error;
    }

    Toast.show({
      type: "success",
      text1: "Registration Successful",
      text2: "Please check your email to confirm your account.",
    });
    router.replace("/login");
  } catch (error: any) {
    console.error("Registration error:", error);
    Toast.show({
      type: "error",
      text1: "Registration Failed",
      text2: error.message || "An error occurred during registration.",
    });
    throw error;
  }
};



const Registration = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(registrationSchema),
    defaultValues: {
      name: '',
      email: '',
      user_name: '',
      password: '',
      instrument: '',
      genre: '',
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await register(data);
    } catch (e) {
      // already handled
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>

      {(['name', 'email', 'user_name', 'instrument', 'genre', 'password'] as const).map((field) => (
        <Controller
          key={field}
          control={control}
          name={field}
          render={({ field: { onChange, value } }) => (
            <>
              <TextInput
                style={styles.input}
                placeholder={field === 'user_name' ? 'Username' : field.charAt(0).toUpperCase() + field.slice(1)}
                placeholderTextColor={styles.placeholder.color}
                secureTextEntry={field === 'password'}
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
              />
              {errors[field] && (
                <Text style={{ color: 'red', marginBottom: 8 }}>
                  {errors[field]?.message as string}
                </Text>
              )}
            </>
          )}
        />
      ))}

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <Link href="/(auth)/login" style={{ marginTop: 12, textAlign: 'center', color: styles.buttonText.color }}>
        Already have an account? Log in
      </Link>
    </View>
  );
};

export default Registration;


const getStyles = (theme: 'light' | 'dark') => {
  const colors = theme === 'light' ? lightThemeColors : darkThemeColors;

  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      justifyContent: 'center',
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 26,
      fontWeight: '600',
      marginBottom: 24,
      textAlign: 'center',
      color: colors.text,
    },
    input: {
      height: 48,
      borderWidth: 1,
      borderColor: colors.secondary,
      borderRadius: 8,
      paddingHorizontal: 12,
      marginBottom: 16,
      color: colors.text,
      backgroundColor: colors.background || 'transparent',
    },
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 12,
    },
    buttonText: {
      color: colors.text || '#fff',
      fontSize: 16,
      fontWeight: '500',
    },
    placeholder: {
      color: colors.text || '#888',
    },
  });
};
