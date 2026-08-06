import { useThemeChangerContext } from '@/presentation/context/ThemeChangerProvider';

export const useThemePreferences = () => {
  const { setTheme, currentTheme, setSystemTheme, isSystemTheme } =
    useThemeChangerContext();

  return {
    darkModeSettings: {
      darkMode: currentTheme === 'dark',
      systemMode: isSystemTheme,
    },
    setDarkMode: setTheme,
    setSystemMode: setSystemTheme,
  };
};
