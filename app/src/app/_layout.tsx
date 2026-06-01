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
} from 'expo-router';
import { useFonts } from 'expo-font';
import '../../global.css';
import { Toaster } from 'sonner-native';
import { useTheme } from '@/hooks/use-theme';
import { AuthProvider } from '@/presentation/providers/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DeviceCheckerProvider } from '@/presentation/providers/DeviceCheckerProvider';

const queryClient = new QueryClient();

const RootLayout = () => {
  const colorScheme = useColorScheme();
  const [assets, errorAssets] = useAssets([
    require('@/assets/loginLightBg.png'),
    require('@/assets/loginDarkBg.png'),
  ]);
  const backgroundColor = useTheme({}, 'background');
  const [fontsLoaded, error] = useFonts({
    'Inter_18pt-Light': require('@/assets/fonts/Inter_18pt-Light.ttf'),
    'Inter_18pt-Regular': require('@/assets/fonts/Inter_18pt-Regular.ttf'),
    'Inter_18pt-Medium': require('@/assets/fonts/Inter_18pt-Medium.ttf'),
    'Inter_18pt-Bold': require('@/assets/fonts/Inter_18pt-Bold.ttf'),
    'Manrope-Light': require('@/assets/fonts/Manrope-Light.ttf'),
    'Manrope-Regular': require('@/assets/fonts/Manrope-Regular.ttf'),
    'Manrope-Medium': require('@/assets/fonts/Manrope-Medium.ttf'),
    'Manrope-Bold': require('@/assets/fonts/Manrope-Bold.ttf'),
    'Poppins-Light': require('@/assets/fonts/Poppins-Light.ttf'),
    'Poppins-Regular': require('@/assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('@/assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Bold': require('@/assets/fonts/Poppins-Bold.ttf'),
  });

  useEffect(() => {
    if (error || errorAssets) throw error;

    async function hideSplash() {
      if (fontsLoaded && colorScheme && assets) {
        await SplashScreen.hideAsync();
      }
    }

    void hideSplash();
  }, [fontsLoaded, colorScheme, assets, error, errorAssets]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ backgroundColor, flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <PaperProvider>
            <AuthProvider>
              <DeviceCheckerProvider>
                <Stack
                  screenOptions={{
                    headerShown: false,
                    animation: 'ios_from_right',
                  }}
                />
              </DeviceCheckerProvider>
            </AuthProvider>
          </PaperProvider>
          <Toaster position="bottom-center" />
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
