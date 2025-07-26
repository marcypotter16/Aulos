import LogoutButton from "@/components/buttons/LogoutButton";
import { useTheme } from "@/hooks/ThemeContext";
import { Stack } from "expo-router";

export default function ProfileLayout() {
    const { colorScheme } = useTheme()
    return (
        <Stack screenOptions={{
            headerShown: true, headerRight: () => <LogoutButton />,
            headerStyle: {
                backgroundColor: colorScheme.background
            },
            headerTitleStyle: {
                color: colorScheme.text
            }
        }}>
            <Stack.Screen name="index" options={{ title: 'Profile' }} />
            <Stack.Screen name="saved" options={{ title: 'Saved Posts' }} />
            <Stack.Screen name="reviews" options={{ title: 'Reviews' }} />
        </Stack>
    );
}
// This layout file defines the structure for the profile section of the app.