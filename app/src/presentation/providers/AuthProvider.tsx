import type { PropsWithChildren } from 'react';
import { useEffect, useRef } from 'react';
import { router, useSegments } from 'expo-router';
import { useAuthStore } from '@/stores/auth/use-auth-store';
import { useSecurityStore } from '@/stores/security/use-security-store';

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { authStatus, checkAuthStatus } = useAuthStore();
  const { isDeviceRegistered, canRegisterDevice } = useSecurityStore();

  const segments = useSegments();
  const didCheckAuth = useRef(false);

  useEffect(() => {
    if (didCheckAuth.current) return;
    didCheckAuth.current = true;
    void checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    if (authStatus === 'checking') return;

    const inAuthGroup = segments[0] === '(auth)';
    // @ts-ignore
    const isAtRoot = segments.length === 0 || segments[0] === undefined;

    if (authStatus === 'not-authenticated') {
      if (!inAuthGroup) {
        router.replace('/(auth)');
      }
    } else if (authStatus === 'authenticated') {
      if (isDeviceRegistered) {
        if (inAuthGroup || segments[0] === 'registro' || isAtRoot) {
          router.replace('/home');
        }
      } else if (canRegisterDevice) {
        if (segments[0] !== 'registro') {
          router.replace('/registro');
        }
      } else {
        if (segments[0] !== 'home') {
          router.replace('/home');
        }
      }
    }
  }, [authStatus, isDeviceRegistered, canRegisterDevice, segments]);

  return <>{children}</>;
};
