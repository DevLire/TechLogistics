import { useEffect } from 'react';
import { ImageBackground } from 'expo-image';
import { router } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/presentation/components/ThemedText';
import { useAuthStore } from '@/stores/auth/useAuthStore';
import { useDeviceCheckerStore } from '@/stores/device-checker/useDeviceCheckerStore';

const bgLight = require('@/assets/loginLightBg.png');
const bgDark = require('@/assets/loginDarkBg.png');

const TechLogisticsApp = () => {
  const colorScheme = useColorScheme();
  const authStatus = useAuthStore((state) => state.authStatus);
  const deviceStatus = useDeviceCheckerStore((state) => state.deviceStatus);

  useEffect(() => {
    if (authStatus === 'checking' || deviceStatus === 'checking') return;
    if (deviceStatus === 'blocked') return;

    router.replace(authStatus === 'authenticated' ? '/registro' : '/(auth)');
  }, [authStatus, deviceStatus]);

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
