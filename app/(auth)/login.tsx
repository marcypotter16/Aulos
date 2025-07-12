import { darkThemeColors, lightThemeColors } from "@/constants";
import { useAuth } from "@/hooks/AuthContext";
import { useTheme } from "@/hooks/ThemeContext";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const LoginPage = () => {
  // Theme management
  const { theme } = useTheme();
  // State management for username and password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Authentication context
  const { login, isLoading, error } = useAuth();

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

      {error && <Text style={{ color: "red", marginBottom: 8 }}>{error}</Text>}

      <TouchableOpacity
        style={getStyles(theme).button}
        onPress={() => login(username, password)}
      >
        <Text style={getStyles(theme).buttonText}>
          {isLoading ? "Logging in..." : "Log In"}
        </Text>
      </TouchableOpacity>
      <Link href={"/registration"} asChild>
        <Text
          style={{
            color:
              theme === "dark" ? darkThemeColors.text : lightThemeColors.text,
            textAlign: "center",
            marginTop: 16,
          }}
        >
          Don't have an account? Register
        </Text>
      </Link>
    </View>
  );
};

export default LoginPage;

const getStyles = (theme: "light" | "dark") =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      justifyContent: "center",
      backgroundColor:
        theme === "dark"
          ? darkThemeColors.background
          : lightThemeColors.background,
    },
    title: {
      fontSize: 28,
      fontWeight: "600",
      marginBottom: 24,
      textAlign: "center",
      color: theme === "dark" ? darkThemeColors.text : lightThemeColors.text,
    },
    input: {
      height: 48,
      borderColor: "#ccc",
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      marginBottom: 16,
      color: theme === "dark" ? darkThemeColors.text : lightThemeColors.text,
    },
    button: {
      backgroundColor:
        theme === "dark" ? darkThemeColors.primary : lightThemeColors.primary,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 12,
    },
    buttonText: {
      color: theme === "dark" ? darkThemeColors.text : lightThemeColors.text,
      fontSize: 16,
      fontWeight: "500",
    },
  });
