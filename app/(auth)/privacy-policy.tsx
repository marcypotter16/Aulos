import { darkThemeColors, lightThemeColors } from "@/constants";
import { useTheme } from "@/hooks/ThemeContext";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function PrivacyPolicyScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Privacy Policy</Text>
      <Text style={styles.lastUpdated}>Last updated: August 1, 2025</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
        <Text style={styles.paragraph}>
          We collect information you provide directly to us, such as:
        </Text>
        <Text style={styles.listItem}>• Account information (username, email, profile details)</Text>
        <Text style={styles.listItem}>• Musical content you upload or share</Text>
        <Text style={styles.listItem}>• Communications with other users</Text>
        <Text style={styles.listItem}>• Usage data and analytics</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          We use the information we collect to:
        </Text>
        <Text style={styles.listItem}>• Provide, maintain, and improve our services</Text>
        <Text style={styles.listItem}>• Process transactions and send notifications</Text>
        <Text style={styles.listItem}>• Communicate with you about the service</Text>
        <Text style={styles.listItem}>• Personalize your experience</Text>
        <Text style={styles.listItem}>• Ensure safety and prevent fraud</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Information Sharing</Text>
        <Text style={styles.paragraph}>
          We do not sell, trade, or rent your personal information. We may share information in these situations:
        </Text>
        <Text style={styles.listItem}>• With your consent</Text>
        <Text style={styles.listItem}>• To comply with legal obligations</Text>
        <Text style={styles.listItem}>• To protect rights, property, or safety</Text>
        <Text style={styles.listItem}>• In connection with business transfers</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Data Security</Text>
        <Text style={styles.paragraph}>
          We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Data Retention</Text>
        <Text style={styles.paragraph}>
          We retain your information for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>6. Your Rights</Text>
        <Text style={styles.paragraph}>
          You have the right to:
        </Text>
        <Text style={styles.listItem}>• Access and update your personal information</Text>
        <Text style={styles.listItem}>• Delete your account and data</Text>
        <Text style={styles.listItem}>• Object to processing of your data</Text>
        <Text style={styles.listItem}>• Request data portability</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>7. Cookies and Analytics</Text>
        <Text style={styles.paragraph}>
          We use cookies and similar technologies to improve user experience and analyze usage patterns. You can control cookie preferences through your device settings.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>8. Third-Party Services</Text>
        <Text style={styles.paragraph}>
          Our app may contain links to third-party services. We are not responsible for the privacy practices of these external services.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>9. Children's Privacy</Text>
        <Text style={styles.paragraph}>
          Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>10. Changes to This Policy</Text>
        <Text style={styles.paragraph}>
          We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>11. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have questions about this Privacy Policy, please contact us at privacy@aulos.app
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