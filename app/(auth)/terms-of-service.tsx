import { darkThemeColors, lightThemeColors } from "@/constants";
import { useTheme } from "@/hooks/ThemeContext";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function TermsOfServiceScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Terms of Service</Text>
      <Text style={styles.lastUpdated}>Last updated: August 1, 2025</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By accessing and using Aulos, you accept and agree to be bound by the terms and provision of this agreement.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Description of Service</Text>
        <Text style={styles.paragraph}>
          Aulos is a social music platform that allows users to share musical content, connect with other musicians, and discover new music.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. User Responsibilities</Text>
        <Text style={styles.paragraph}>
          Users are responsible for:
        </Text>
        <Text style={styles.listItem}>• Maintaining the confidentiality of their account information</Text>
        <Text style={styles.listItem}>• Ensuring all content shared complies with applicable laws</Text>
        <Text style={styles.listItem}>• Respecting intellectual property rights</Text>
        <Text style={styles.listItem}>• Not engaging in harmful or abusive behavior</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Content Policy</Text>
        <Text style={styles.paragraph}>
          Users may not post content that is:
        </Text>
        <Text style={styles.listItem}>• Illegal, harmful, or offensive</Text>
        <Text style={styles.listItem}>• Infringing on copyrights or other intellectual property</Text>
        <Text style={styles.listItem}>• Spam or misleading</Text>
        <Text style={styles.listItem}>• Violating privacy of others</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Privacy</Text>
        <Text style={styles.paragraph}>
          Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>6. Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          Aulos shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>7. Changes to Terms</Text>
        <Text style={styles.paragraph}>
          We reserve the right to modify these terms at any time. Users will be notified of significant changes.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>8. Contact</Text>
        <Text style={styles.paragraph}>
          If you have questions about these Terms of Service, please contact us at support@aulos.app
        </Text>
      </View>
    </ScrollView>
  );
}

const getStyles = (theme: "dark" | "light") => {
  const colors = theme === "dark" ? darkThemeColors : lightThemeColors;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 20,
      paddingBottom: 40,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.text,
      textAlign: "center",
      marginBottom: 10,
    },
    lastUpdated: {
      fontSize: 14,
      color: colors.secondary,
      textAlign: "center",
      marginBottom: 30,
    },
    section: {
      marginBottom: 25,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 10,
    },
    paragraph: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 24,
      marginBottom: 10,
    },
    listItem: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 24,
      marginLeft: 10,
      marginBottom: 5,
    },
  });
};