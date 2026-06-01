import { useEffect } from 'react';
import { ImageBackground } from 'expo-image';
import { router } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/presentation/components/ThemedText';
import { useAuthStore } from '@/stores/auth/useAuthStore';
import { useSecurityStore } from '@/stores/security/useSecurityStore';

const bgLight = require('@/assets/loginLightBg.png');
const bgDark = require('@/assets/loginDarkBg.png');

const TechLogisticsApp = () => {
  const colorScheme = useColorScheme();
  const authStatus = useAuthStore((state) => state.authStatus);
  const { isDeviceRegistered, canRegisterDevice } = useSecurityStore();

  useEffect(() => {
    if (authStatus === 'checking') return;

    if (authStatus === 'authenticated') {
      if (isDeviceRegistered) {
        router.replace('/home');
      } else if (canRegisterDevice) {
        router.replace('/registro');
      } else {
        router.replace('/home');
      }
    } else {
      router.replace('/(auth)');
    }
  }, [authStatus, isDeviceRegistered, canRegisterDevice]);

  return (
    <ImageBackground
      cachePolicy="memory-disk"
      priority="high"
      source={colorScheme === 'light' ? bgLight : bgDark}
      style={{ flex: 1 }}
      transition={300}
    >
      <View className="flex-1 items-center justify-center gap-5">
        <ActivityIndicator className="color-primary" size={60} />
        <ThemedText type="h2">Cargando...</ThemedText>
        <ThemedText type="semi-bold">
          Preparandole la mejor experiencia
        </ThemedText>
      </View>
    </ImageBackground>
  );
};

export default TechLogisticsApp;
