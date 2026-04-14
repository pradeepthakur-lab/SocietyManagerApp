import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkColors, lightColors } from '../constants/colors';

const THEME_KEY = '@society_theme';
const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_KEY);
      if (saved !== null) {
        setIsDark(saved === 'dark');
      }
    } catch (e) {
      console.warn('Failed to load theme:', e);
    }
  };

  const toggleTheme = useCallback(async () => {
    const next = !isDark;
    setIsDark(next);
    try {
      await AsyncStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
    } catch (e) {
      console.warn('Failed to save theme:', e);
    }
  }, [isDark]);

  const setTheme = useCallback(async (mode) => {
    const dark = mode === 'dark';
    setIsDark(dark);
    try {
      await AsyncStorage.setItem(THEME_KEY, mode);
    } catch (e) {
      console.warn('Failed to save theme:', e);
    }
  }, []);

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ colors, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
