import { createContext, useContext, useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Colors } from '@/constants/theme';

interface ThemeChangerContextType {
  currentTheme: 'light' | 'dark';
  isSystemTheme: boolean;
  bgColor: string;
  setTheme: (isDark: boolean) => void;
  setSystemTheme: (isSystem: boolean) => void;
}

const ThemeChangerContext = createContext({} as ThemeChangerContextType);

export const useThemeChangerContext = () => useContext(ThemeChangerContext);

// Provider
export const ThemeChangerProvider = ({ children }: PropsWithChildren) => {
  const colorScheme = useColorScheme();
  const setColorScheme = Appearance.setColorScheme;

  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');
  const [isSystemThemeEnabled, setIsSystemThemeEnabled] = useState(true);

  const currentTheme =
    isSystemThemeEnabled && (colorScheme === 'light' || colorScheme === 'dark')
      ? colorScheme
      : isDarkMode
        ? 'dark'
        : 'light';

  const backgroundColor =
    currentTheme === 'dark' ? Colors.dark.background : Colors.light.background;

  useEffect(() => {
    SecureStore.getItemAsync('selected-theme').then((theme) => {
      if (!theme) return;

      setIsDarkMode(theme === 'dark');
      setIsSystemThemeEnabled(theme === 'unspecified');
      setColorScheme(theme as 'light' | 'dark' | 'unspecified');
    });
  }, []);

  return (
    <ThemeProvider value={currentTheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ThemeChangerContext.Provider
        value={{
          currentTheme: currentTheme ?? 'light',
          isSystemTheme: isSystemThemeEnabled,
          bgColor: backgroundColor,

          // Recibe el valor exacto del Switch
          setTheme: async (isDark: boolean) => {
            const nextTheme = isDark ? 'dark' : 'light';

            // Actualizar el estado de React
            setIsSystemThemeEnabled(false);
            setIsDarkMode(isDark);

            // Esperar al siguiente render para nativewind
            requestAnimationFrame(() => {
              setColorScheme(nextTheme);
            });

            await SecureStore.setItemAsync('selected-theme', nextTheme);
          },

          setSystemTheme: async (isSystem: boolean) => {
            // Actualizar el estado de React
            setIsSystemThemeEnabled(isSystem);

            if (isSystem) {
              // Esperar al siguiente render para nativewind
              requestAnimationFrame(() => {
                setColorScheme('unspecified');
              });
              await SecureStore.setItemAsync('selected-theme', 'unspecified');
            } else {
              const fallbackTheme = isDarkMode ? 'dark' : 'light';

              requestAnimationFrame(() => {
                setColorScheme(fallbackTheme);
              });
              await SecureStore.setItemAsync('selected-theme', fallbackTheme);
            }
          },
        }}
      >
        {children}
      </ThemeChangerContext.Provider>
    </ThemeProvider>
  );
};
