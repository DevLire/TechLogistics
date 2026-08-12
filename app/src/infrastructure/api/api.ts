import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

const API_URL =
  Platform.OS === 'android' && !Device.isDevice
    ? process.env.EXPO_PUBLIC_API_EMULATOR_URL
    : process.env.EXPO_PUBLIC_API_DEVICE_URL;

if (!API_URL) {
  throw new Error('API URL is not defined');
}

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export { api };
