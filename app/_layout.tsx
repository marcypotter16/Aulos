import { AuthProvider } from "@/hooks/AuthContext";
import { ThemeProvider } from "@/hooks/ThemeContext";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({});

/**
 * This is the root layout for the app.
 * It wraps the entire application in a ThemeProvider so that we can use light and dark themes.
 * The Slot component is used to render the current screen.
 * The TabsLayout is included in the app/(tabs) directory.
 */
export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        // Artificially delay for 2 seconds to simulate slow loading
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <ThemeProvider>
        <AuthProvider>
          <Slot /> {/* This will now include TabsLayout and all screens, it's basically a placeholder for the entire app */}
          <Toast /> {/* Toast component for displaying messages */}
        </AuthProvider>
      </ThemeProvider>
    </View>
  );
}
