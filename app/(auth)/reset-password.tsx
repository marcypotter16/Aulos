import { darkThemeColors, lightThemeColors } from "@/constants";
import { useTheme } from "@/hooks/ThemeContext";
import { supabase } from "@/supabase";
import { showError } from "@/utils/ErrorUtils";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ResetPasswordScreen() {
  const { theme } = useTheme();
  const { token } = useLocalSearchParams<{ token?: string }>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      showError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      showError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      showError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      Alert.alert(
        "Password Reset Successful",
        "Your password has been updated successfully.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/(auth)/login"),
          },
        ]
      );
    } catch (error: any) {
      showError(error.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Set New Password</Text>
        <Text style={styles.subtitle}>
          Enter your new password below.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="New Password"
          placeholderTextColor={
            theme === "dark" ? darkThemeColors.secondary : lightThemeColors.secondary
          }
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor={
            theme === "dark" ? darkThemeColors.secondary : lightThemeColors.secondary
          }
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleResetPassword}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Updating..." : "Update Password"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/(auth)/login")}
        >
          <Text style={styles.backButtonText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getStyles = (theme: "dark" | "light") => {
  const colors = theme === "dark" ? darkThemeColors : lightThemeColors;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: "center",
      padding: 20,
    },
    form: {
      backgroundColor: colors.surface,
      padding: 20,
      borderRadius: 10,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text,
      textAlign: "center",
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      color: colors.secondary,
      textAlign: "center",
      marginBottom: 30,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 15,
      marginBottom: 15,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.background,
    },
    button: {
      backgroundColor: colors.primary,
      padding: 15,
      borderRadius: 8,
      alignItems: "center",
      marginBottom: 15,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
    backButton: {
      alignItems: "center",
    },
    backButtonText: {
      color: colors.primary,
      fontSize: 16,
    },
  });
};