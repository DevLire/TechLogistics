import { api } from '@/core/api/api';
import type { AuthResponse } from '@/infrastructure/interfaces/responses/auth.response';
import * as SecureStore from 'expo-secure-store';

export const checkAuthAction = async (): Promise<AuthResponse> => {
  try {
    const token = await SecureStore.getItemAsync('token');
    console.log('check-auth-action-log: ' + token);
    const { data } = await api.get<AuthResponse>('/auth/check-status');
    return data;
  } catch (error) {
    throw new Error('Token expired or not valid', { cause: error });
  }
};
