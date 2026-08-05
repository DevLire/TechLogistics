import type { PropsWithChildren } from 'react';
import { useEffect, useRef } from 'react';
import type { Socket } from 'socket.io-client';

import { createSocket } from '@/infrastructure/socket/socket.client';
import { useAuthStore } from '@/stores/auth/useAuthStore';
import { getUniqueDeviceId } from '@/infrastructure/security/deviceSecurity';

export const SocketProvider = ({ children }: PropsWithChildren) => {
  const { authStatus, token } = useAuthStore();

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (authStatus !== 'authenticated' || !token) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      return;
    }

    const connectSocket = async () => {
      const deviceId = await getUniqueDeviceId();

      const socket = createSocket({
        token,
        deviceId,
      });

      socket.connect();

      socketRef.current = socket;
    };

    void connectSocket();

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [authStatus, token]);

  return <>{children}</>;
};
