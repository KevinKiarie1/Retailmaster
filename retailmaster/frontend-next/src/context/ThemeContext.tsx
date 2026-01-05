'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  mounted: boolean;
}

// Default context value for SSR
const defaultContextValue: ThemeContextType = {
  isDarkMode: true,
  toggleTheme: () => {},
  mounted: false,
};

const ThemeContext = createContext<ThemeContextType>(defaultContextValue);

export const useTheme = (): ThemeContextType => {
  return useContext(ThemeContext);
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    // Check localStorage for saved preference, default to dark mode
    const saved = localStorage.getItem('theme');
    setIsDarkMode(saved ? saved === 'dark' : true);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      // Apply theme to document
      document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }
  }, [isDarkMode, mounted]);

  const toggleTheme = (): void => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
