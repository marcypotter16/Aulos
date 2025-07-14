import { darkThemeColors, lightThemeColors } from '@/constants';
import { useTheme } from '@/hooks/ThemeContext';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { UserCreate } from '../schemas/user';

const register = async (name: string, email: string, user_name: string, password: string, instrument: string | undefined, genre: string | undefined): Promise<void> => {
  const user: UserCreate = {
    name: name,
    email,
    user_name,
    password,
    instrument: instrument || null,
    genre: genre || null,
  };
  
  try {
    const response = await fetch("http://127.0.0.1:8000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || "Registration failed");
    Toast.show({
      type: "success",
      text1: "Registration Successful",
      text2: "You can now log in with your credentials.",
    })
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
  const { theme } = useTheme(); // 'light' or 'dark'
  const styles = getStyles(theme);

  const [email, setEmail] = useState('');
  const [user_name, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [instrument, setInstrument] = useState('');
  const [genre, setGenre] = useState('');
  const [name, setName] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor={styles.placeholder.color}
        autoCapitalize="words"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={styles.placeholder.color}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor={styles.placeholder.color}
        autoCapitalize="none"
        value={user_name}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Instrument"
        placeholderTextColor={styles.placeholder.color}
        autoCapitalize="none"
        value={instrument}
        onChangeText={setInstrument}
      />

      <TextInput
        style={styles.input}
        placeholder="Genre"
        placeholderTextColor={styles.placeholder.color}
        autoCapitalize="none"
        value={genre}
        onChangeText={setGenre}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={styles.placeholder.color}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />


      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          try {
            await register(name, email, user_name, password, instrument, genre);
          } catch (e) {
            // Error handled in register
          }
        }}
      >
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
