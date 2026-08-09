import type { PropsWithChildren } from 'react';
import { useEffect, useRef } from 'react';
import type { Socket } from 'socket.io-client';

import { createSocket } from '@/infrastructure/socket/socket.client';
import { useAuthStore } from '@/stores/auth/use-auth-store';
import { getUniqueDeviceId } from '@/infrastructure/security/deviceSecurity';
import { registerSocketListeners } from '@/infrastructure/socket/register-listeners';

export const SocketProvider = ({ children }: PropsWithChildren) => {
  const { authStatus, checkAuthStatus } = useAuthStore();

  const socketRef = useRef<Socket | null>(null);
  const hasConnectedOnce = useRef(false);

  useEffect(() => {
    if (authStatus !== 'authenticated') {
      socketRef.current?.disconnect();
      socketRef.current = null;
      hasConnectedOnce.current = false;
      return;
    }

    const connectSocket = async () => {
      const deviceId = await getUniqueDeviceId();

      const token = useAuthStore.getState().token;

      if (!token) return;

      const socket = createSocket({
        token,
        deviceId,
      });

      socket.on('connect', () => {
        if (!hasConnectedOnce.current) {
          hasConnectedOnce.current = true;
          return;
        }

        void checkAuthStatus();
      });

      registerSocketListeners(socket);

      socket.connect();

      socketRef.current = socket;
    };

    void connectSocket();

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [authStatus]);

  return <>{children}</>;
};
