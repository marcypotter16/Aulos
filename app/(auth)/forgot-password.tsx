import { darkThemeColors, lightThemeColors } from "@/constants";
import { useTheme } from "@/hooks/ThemeContext";
import { supabase } from "@/supabase";
import { showError } from "@/utils/ErrorUtils";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function ForgotPasswordScreen() {
  const { colorScheme } = useTheme();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      showError(new Error, "Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "aulos://reset-password",
      });

      if (error) throw error;

      Toast.show({
        type: "success",
        text1: "Password Reset",
        text2: "Check your email for a password reset link.",
      });
      router.back();
    } catch (error: any) {
      showError(error, "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  const styles = getStyles(colorScheme);

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter your email address and we'll send you a link to reset your password.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colorScheme.secondary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleResetPassword}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getStyles = (colors: typeof lightThemeColors) => {

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
      lineHeight: 22,
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