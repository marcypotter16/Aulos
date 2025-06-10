import { Stack } from "expo-router";

export default function ProfileLayout() {
    return (
        <Stack screenOptions={{ headerShown: true }}>
            <Stack.Screen name="index" options={{ title: 'Profile' }} />
            <Stack.Screen name="saved" options={{ title: 'Saved Posts' }} />
            <Stack.Screen name="reviews" options={{ title: 'Reviews' }} />
        </Stack>
    );
}
// This layout file defines the structure for the profile section of the app.