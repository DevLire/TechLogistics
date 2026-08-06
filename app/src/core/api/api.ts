import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

const API_URL =
  Platform.OS === 'android' && !Device.isDevice
    ? 'http://10.0.2.2:3000/api'
    : 'http://192.168.1.253:3000/api';

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
