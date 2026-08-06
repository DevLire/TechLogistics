import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

const SOCKET_URL =
  Platform.OS === 'android' && !Device.isDevice
    ? 'http://10.0.2.2:3000'
    : 'http://192.168.1.253:3000';

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
