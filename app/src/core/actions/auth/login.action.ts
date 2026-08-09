import { api } from '@/infrastructure/api/api';
import type { AuthResponse } from '@/infrastructure/interfaces/responses/auth.response';

export const loginAction = async (
  email: string,
  password: string,
  deviceId: string
): Promise<AuthResponse> => {
  try {
    const { data } = await api.post<AuthResponse>('/auth/login', {
      email: email,
      password: password,
      deviceId: deviceId,
    });

    return data;
  } catch (error) {
    console.warn(error);
    throw error;
  }
};
