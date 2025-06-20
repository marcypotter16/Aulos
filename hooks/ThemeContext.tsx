import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
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
    };
    initTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    // TODO: remove this print statement in production
    console.log(`Theme changed to: ${newTheme}`);
    // Store the new theme in AsyncStorage
    await AsyncStorage.setItem('app-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
