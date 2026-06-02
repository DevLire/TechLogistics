import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ImageBackground } from 'expo-image';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { ThemedModal } from '@/presentation/components/ThemedModal';
import { ThemedButton } from '@/presentation/components/ThemedButton';

import { useAuthStore } from '@/stores/auth/useAuthStore';
import { useSecurityStore } from '@/stores/security/useSecurityStore';

const bgLight = require('@/assets/loginLightBg.png');
const bgDark = require('@/assets/loginDarkBg.png');

export const DeviceCheckerProvider = ({ children }: PropsWithChildren) => {
  const colorScheme = useColorScheme();
  const authStatus = useAuthStore((state) => state.authStatus);
  const logout = useAuthStore((state) => state.logout);
  const { isDeviceRegistered, canRegisterDevice, isCheckingSecurity } =
    useSecurityStore();

  const isBlocked =
    authStatus === 'authenticated' &&
    !isCheckingSecurity &&
    !isDeviceRegistered &&
    !canRegisterDevice;

  return (
    <>
      {children}

      {isBlocked && (
        <View className="z-50" style={StyleSheet.absoluteFill}>
          <ImageBackground
            cachePolicy="memory-disk"
            priority="high"
            source={colorScheme === 'light' ? bgLight : bgDark}
            style={{ flex: 1 }}
            transition={300}
          />

          <ThemedModal
            visible
            description="Consulte con el administrador para poder habilitar este terminal y registrar su acceso."
            title="Dispositivo no autorizado"
          >
            <ThemedButton className="mt-2" onPress={logout}>
              Cerrar sesión
            </ThemedButton>
          </ThemedModal>
        </View>
      )}
    </>
  );
};
