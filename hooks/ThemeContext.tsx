import { ColorScheme, darkThemeColors, lightThemeColors } from '@/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  colorScheme: ColorScheme
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  colorScheme: lightThemeColors,
  toggleTheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ theme, setTheme ] = useState<Theme>('light');
  const [ colorScheme, setColorScheme ] = useState<ColorScheme>(lightThemeColors)
  // useEffect(() => {
  //   if (typeof document !== 'undefined') {
  //     // This is for web, where we can set the class on the body
  //     const background = theme === 'dark' ? darkThemeColors.background : '#fff';
  //     document.body.style.backgroundColor = background;
  //     document.documentElement.style.backgroundColor = background;
  //   }

  // }, [theme]);

  // Load stored or system theme on startup
  useEffect(() => {
    // Initialize theme from AsyncStorage or system preference
    const initTheme = async () => {
      const stored = await AsyncStorage.getItem('app-theme');
      if (stored === 'light' || stored === 'dark') {
        setTheme(stored);
      } else {
        const systemTheme = Appearance.getColorScheme() as Theme;
        setTheme(systemTheme || 'light');
      }
      setColorScheme(theme === 'light' ? lightThemeColors : darkThemeColors)
    };
    initTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    const newColorScheme = newTheme === 'light' ? lightThemeColors : darkThemeColors
    setTheme(newTheme);
    setColorScheme(newColorScheme)
    // Store the new theme in AsyncStorage
    await AsyncStorage.setItem('app-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, colorScheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
