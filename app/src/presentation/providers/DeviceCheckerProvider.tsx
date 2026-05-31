import type { PropsWithChildren } from 'react';
import { useEffect, useRef } from 'react';
import { ImageBackground } from 'expo-image';
import { ThemedModal } from '@/presentation/components/ThemedModal';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/stores/auth/useAuthStore';
import { useDeviceCheckerStore } from '@/stores/device-checker/useDeviceCheckerStore';
import { ThemedButton } from '@/presentation/components/ThemedButton';

const bgLight = require('@/assets/loginLightBg.png');
const bgDark = require('@/assets/loginDarkBg.png');

export const DeviceCheckerProvider = ({ children }: PropsWithChildren) => {
  const colorScheme = useColorScheme();
  const authStatus = useAuthStore((state) => state.authStatus);
  const deviceStatus = useDeviceCheckerStore((state) => state.deviceStatus);
  const checkDeviceStatus = useDeviceCheckerStore(
    (state) => state.checkDeviceStatus
  );
  const didCheckDevice = useRef(false);

  useEffect(() => {
    if (authStatus === 'checking') return;
    if (didCheckDevice.current) return;

    didCheckDevice.current = true;
    void checkDeviceStatus();
  }, [authStatus, checkDeviceStatus]);

  if (deviceStatus === 'blocked') {
    return (
      <ImageBackground
        cachePolicy="memory-disk"
        priority="high"
        source={colorScheme === 'light' ? bgLight : bgDark}
        style={{ flex: 1 }}
        transition={300}
      >
        <ThemedModal
          visible
          description="Consulte con el administrador para poder registrar el dispositivo."
          title="Este dispositivo no está registrado"
        />
        <ThemedButton>Cerrar sesión</ThemedButton>
      </ImageBackground>
    );
  }

  return <>{children}</>;
};
