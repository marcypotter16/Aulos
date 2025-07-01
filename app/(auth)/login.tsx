import { darkThemeColors, lightThemeColors } from '@/constants';
import { useTheme } from '@/hooks/ThemeContext';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const LoginPage = () => {
  const { theme } = useTheme(); // Assuming you have a useTheme hook to get the current theme
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    // You can replace this with your actual backend call
    console.log('Logging in with:', { username, password });
    try {
    const response = await fetch('http://127.0.0.1:8000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_name: username,
        password: password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Login failed');
    }

    const data = await response.json();
    console.log('Login success:', data);
    Alert.alert('Success', 'Logged in successfully!');
    // You could also store user_id, redirect, etc.
  } catch (error: any) {
    console.error('Login error:', error);
    Alert.alert('Error', error.message);
  }
    Alert.alert('Login clicked', 'You can now connect this to your FastAPI backend.');
  };

  return (
    <View style={getStyles(theme).container}>
      <Text style={getStyles(theme).title}>Welcome Back</Text>

      <TextInput
        style={getStyles(theme).input}
        placeholder="Username"
        keyboardType="default"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={getStyles(theme).input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={getStyles(theme).button} onPress={handleLogin}>
        <Text style={getStyles(theme).buttonText}>Log In</Text>
      </TouchableOpacity>
      <Link href={"/registration"} asChild>
        <Text style={{ color: theme === 'dark' ? darkThemeColors.text : lightThemeColors.text, textAlign: 'center', marginTop: 16 }}>
          Don't have an account? Register
        </Text>
      </Link>
    </View>
  );
};

export default LoginPage;

const getStyles = (theme: 'light' | 'dark') => StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: theme === 'dark' ? darkThemeColors.background : lightThemeColors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
    color: theme === 'dark' ? darkThemeColors.text : lightThemeColors.text,
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    color: theme === 'dark' ? darkThemeColors.text : lightThemeColors.text,
  },
  button: {
    backgroundColor: theme === 'dark' ? darkThemeColors.primary : lightThemeColors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: theme === 'dark' ? darkThemeColors.text : lightThemeColors.text,
    fontSize: 16,
    fontWeight: '500',
  },
});
