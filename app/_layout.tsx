import { AuthProvider } from "@/hooks/AuthContext";
import { ThemeProvider } from "@/hooks/ThemeContext";
import { Slot } from "expo-router";
/**
 * This is the root layout for the app.
 * It wraps the entire application in a ThemeProvider so that we can use light and dark themes.
 * The Slot component is used to render the current screen.
 * The TabsLayout is included in the app/(tabs) directory.
 */
export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Slot /> {/* This will now include TabsLayout and all screens, it's basically a placeholder for the entire app */}
      </AuthProvider>
    </ThemeProvider>
  );
}
