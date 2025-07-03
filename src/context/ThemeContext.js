
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

const lightColors = {
  mode: 'light',
  background: '#FFFFFF',
  text: '#000000',
  card: '#F0F0F0',
  primary: '#007AFF',
  placeholder: '#888888',
};

const darkColors = {
  mode: 'dark',
  background: '#121212',
  text: '#FFFFFF',
  card: '#1E1E1E',
  primary: '#0AF',
  placeholder: '#BBBBBB',
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);


  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('theme');
        if (storedTheme) {
          setIsDark(storedTheme === 'dark');
        } else {
          const systemTheme = Appearance.getColorScheme();
          setIsDark(systemTheme === 'dark');
        }
      } catch (err) {
        console.error('Error loading theme:', err.message);
      }
    };
    loadTheme();
  }, []);


  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (err) {
      console.error('Error saving theme:', err.message);
    }
  };

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
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








