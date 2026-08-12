import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

const SOCKET_URL =
  Platform.OS === 'android' && !Device.isDevice
    ? process.env.EXPO_PUBLIC_SOCKET_EMULATOR_URL
    : process.env.EXPO_PUBLIC_SOCKET_DEVICE_URL;

if (!SOCKET_URL) {
  throw new Error('Socket URL is not defined');
}
interface CreateSocketOptions {
  token: string;
  deviceId: string;
}

export const createSocket = ({
  token,
  deviceId,
}: CreateSocketOptions): Socket => {
  return io(SOCKET_URL, {
    autoConnect: false,
    auth: {
      token,
      deviceId,
    },
  });
};
