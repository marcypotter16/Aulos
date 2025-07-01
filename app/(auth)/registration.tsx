import { darkThemeColors, lightThemeColors } from '@/constants';
import { useTheme } from '@/hooks/ThemeContext';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const Registration = () => {
  const { theme } = useTheme(); // 'light' or 'dark'
  const styles = getStyles(theme);

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    if (!email || !username || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    console.log('Registering:', { email, username, password });
    Alert.alert('Success', 'Registration logic pending backend integration.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>

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
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={styles.placeholder.color}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
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
