/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    primary: '#00a343',
    secondary: '#d1d7e0',
    tertiary: '#e6f4ea',
    surface: '#f5f7f9',
    success: '#10b981',
    error: '#dc2626',
    text: '#0f172a',
    textMuted: '#64748b',
    background: '#eaedf1',

    // Colores del modo oscuro
    inverse: {
      primary: '#00c853',
      secondary: '#2a2e2c',
      tertiary: '#1a241f',
      surface: '#1a1a1e',
      success: '#00e676',
      error: '#ff5252',
      text: '#f3f7f6',
      textMuted: '#7c8783',
      background: '#121214',
    },
  },
  dark: {
    primary: '#00c853',
    secondary: '#2a2e2c',
    tertiary: '#1a241f',
    surface: '#1a1a1e',
    success: '#00e676',
    error: '#ff5252',
    text: '#f3f7f6',
    textMuted: '#7c8783',
    background: '#121214',

    // Colores del modo claro
    inverse: {
      primary: '#00a343',
      secondary: '#d1d7e0',
      tertiary: '#e6f4ea',
      surface: '#f5f7f9',
      success: '#10b981',
      error: '#dc2626',
      text: '#0f172a',
      textMuted: '#64748b',
      background: '#eaedf1',
    },
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
