import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL;

interface CreateSocketOptions {
  token: string;
  deviceId: string;
}

export const createSocket = ({
  token,
  deviceId,
}: CreateSocketOptions): Socket => {
  if (!SOCKET_URL) {
    throw new Error('EXPO_PUBLIC_SOCKET_URL no está configurada');
  }

  return io(SOCKET_URL, {
    autoConnect: false,
    auth: {
      token,
      deviceId,
    },
  });
};
