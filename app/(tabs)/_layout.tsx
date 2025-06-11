import HeaderToggleButton from "@/components/HeaderToggleButton";
import { darkThemeColors, lightThemeColors } from "@/constants";
import { useTheme } from "@/hooks/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

/**
 * This is the root layout for the app.
 * It defines the tab navigation structure, like instagram.
 * Each screen is defined as a tab, and the options can be customized.
 * The tabs are defined in the `app/(tabs)` directory.
 */

export default function TabsLayout() {
  const { theme } = useTheme();
  // The colorScheme variable is used to set the active and inactive tint colors for the tabs
  // and the background color of the tab bar, accordingly to the theme.
  const colorScheme = theme === 'dark' ? darkThemeColors : lightThemeColors;
  return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colorScheme.primary,
          tabBarInactiveTintColor: colorScheme.secondary,
          tabBarStyle: {
            backgroundColor: colorScheme.background,
          },
        }}>
        <Tabs.Screen
          name="index"
          // You can customize the header with a button to toggle theme
          options={{ 
            title: "Home",
            headerStyle: {
              backgroundColor: colorScheme.surface,
            },
            // headerTintColor: colorScheme.text,
            headerTitleStyle: {
              backgroundColor: colorScheme.surface,
              color: colorScheme.text,
            },
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={size}
                color={color}
              />
            ),

            // This is the "toggle theme" button in the header
            headerRight: () => <HeaderToggleButton />,
          }}
        />
        {/* This is the home screen, which is the first tab */}
        <Tabs.Screen
          name="search"
          options={{ 
            title: "Search",
            headerStyle: {
              backgroundColor: colorScheme.surface,
            },
            // headerTintColor: colorScheme.text,
            headerTitleStyle: {
              backgroundColor: colorScheme.surface,
              color: colorScheme.text,
            },
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "search" : "search-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />  
        <Tabs.Screen
          name="profile"
          options={{ 
            title: "Profile", 
            headerShown: false,
            
            // This is the icon for the profile tab
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
  );
}