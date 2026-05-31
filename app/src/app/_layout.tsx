import { useEffect } from 'react';
import { useAssets } from 'expo-asset';
import { useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  SplashScreen,
  Stack,
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
  router,
} from 'expo-router';
import { useFonts } from 'expo-font';
import '../../global.css';
import { Toaster } from 'sonner-native';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/stores/auth/useAuthStore';
import { AuthProvider } from '@/presentation/providers/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const RootLayout = () => {
  const colorScheme = useColorScheme();
  const [assets, errorAssets] = useAssets([
    require('@/assets/loginLightBg.png'),
    require('@/assets/loginDarkBg.png'),
  ]);
  const { authStatus, isAppLoading, stopAppLoading } = useAuthStore();
  const backgroundColor = useTheme({}, 'background');
  const queryClient = new QueryClient();

  const [fontsLoaded, error] = useFonts({
    // INTER
    'Inter_18pt-Light': require('@/assets/fonts/Inter_18pt-Light.ttf'),
    'Inter_18pt-Regular': require('@/assets/fonts/Inter_18pt-Regular.ttf'),
    'Inter_18pt-Medium': require('@/assets/fonts/Inter_18pt-Medium.ttf'),
    'Inter_18pt-Bold': require('@/assets/fonts/Inter_18pt-Bold.ttf'),

    // MANROPE
    'Manrope-Light': require('@/assets/fonts/Manrope-Light.ttf'),
    'Manrope-Regular': require('@/assets/fonts/Manrope-Regular.ttf'),
    'Manrope-Medium': require('@/assets/fonts/Manrope-Medium.ttf'),
    'Manrope-Bold': require('@/assets/fonts/Manrope-Bold.ttf'),

    // POPPINS
    'Poppins-Light': require('@/assets/fonts/Poppins-Light.ttf'),
    'Poppins-Regular': require('@/assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('@/assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Bold': require('@/assets/fonts/Poppins-Bold.ttf'),
  });

  useEffect(() => {
    if (isAppLoading) return;

    if (authStatus === 'authenticated') router.replace('/home');
    if (authStatus === 'not-authenticated') router.replace('/(auth)');
  }, [authStatus, isAppLoading]);

  useEffect(() => {
    if (error || errorAssets) throw error;
    async function hideSplash() {
      if (fontsLoaded && colorScheme && assets) {
        await SplashScreen.hideAsync();
      }
    }
    hideSplash();
  }, [fontsLoaded, colorScheme, assets, error, errorAssets]);

  if (!fontsLoaded && !error) {
    return null;
  }
  return (
    <GestureHandlerRootView
      style={{ backgroundColor: backgroundColor, flex: 1 }}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        >
          <PaperProvider>
            <AuthProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: 'ios_from_right',
                }}
              />
              <Toaster position="bottom-center" />
            </AuthProvider>
          </PaperProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
