import { darkThemeColors, lightThemeColors } from "@/constants";
import { useAuth } from "@/hooks/AuthContext";
import { useTheme } from "@/hooks/ThemeContext";
import { supabase } from "@/supabase";
import { Link, router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const LoginPage = () => {
  // Theme management
  const { theme } = useTheme();
  // State management for username and password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { isLoading: authLoading } = useAuth();
  
  // Refs for navigation
  const passwordRef = useRef<TextInput>(null);

  // Authentication context
  const handleLogin = async () => {
    setLocalError(null);
    setIsLoggingIn(true);

    try {
      let emailToUse = username.trim();

      // If it's a username (not an email), look up the email
      if (!username.includes("@")) {
        // The data should be the actual email!
        const { data, error } = await supabase.rpc("lookup_email_by_username", {
          uname: username.trim(),
        });

        console.log(data, error);

        if (error || !data) {
          throw new Error("Invalid username or password");
        }

        emailToUse = data;
      }

      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password,
      });

      if (loginError) {
        throw loginError;
      }

      router.replace("/");
    } catch (err: any) {
      setLocalError(err.message || "Login failed");
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: err.message || "Invalid credentials.",
      });
    } finally {
      setIsLoggingIn(false);
    }
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
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
        blurOnSubmit={false}
      />

      <TextInput
        ref={passwordRef}
        style={getStyles(theme).input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        returnKeyType="done"
        onSubmitEditing={handleLogin}
      />

      {localError && (
        <Text style={{ color: "red", marginBottom: 8 }}>{localError}</Text>
      )}

      <TouchableOpacity style={getStyles(theme).button} onPress={handleLogin}>
        <Text style={getStyles(theme).buttonText}>
          {isLoggingIn || authLoading ? "Logging in..." : "Log In"}
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
