import HomeButton from "@/components/buttons/HomeButton";
import { darkThemeColors, lightThemeColors } from "@/constants";
import { useTheme } from "@/hooks/ThemeContext";
import { Stack } from "expo-router";
import React from "react";

export default function LoginLayout() {
    const { theme } = useTheme();
    const colorScheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
    
    return (
        <Stack screenOptions={{ headerTintColor: colorScheme.text,
          headerStyle: {
            backgroundColor: colorScheme.background,
          }, }}>
            <Stack.Screen name="login" options={{ headerTitle: "", headerShown: true, 
                headerLeft: () => <HomeButton theme={theme}
                /> }} />
            <Stack.Screen name="register" options={{ title: 'Register', headerTitle: "", headerShown: false }} />
            <Stack.Screen name="forgot-password" options={{ title: 'Forgot Password' }} />
            <Stack.Screen name="reset-password" options={{ title: 'Reset Password' }} />
            <Stack.Screen name="terms-of-service" options={{ title: 'Terms of Service' }} />
            <Stack.Screen name="privacy-policy" options={{ title: 'Privacy Policy' }} />
        </Stack>
    );
}