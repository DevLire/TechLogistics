import { api } from '@/core/api/api';
import type { AuthResponse } from '@/infrastructure/interfaces/responses/auth.response';

export const checkAuthAction = async (
  deviceId: string
): Promise<AuthResponse> => {
  try {
    const { data } = await api.get<AuthResponse>('/auth/check-status', {
      headers: {
        'x-device-id': deviceId || '',
      },
    });
    return data;
  } catch (error) {
    throw new Error('Token expired or not valid', { cause: error });
  }
};
