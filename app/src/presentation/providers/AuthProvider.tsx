import type { PropsWithChildren } from 'react';
import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/auth/useAuthStore';

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);
  const didCheckAuth = useRef(false);

  useEffect(() => {
    if (didCheckAuth.current) return;

    didCheckAuth.current = true;
    void checkAuthStatus();
  }, [checkAuthStatus]);

  return <>{children}</>;
};
