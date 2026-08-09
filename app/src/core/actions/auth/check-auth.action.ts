import { api } from '@/infrastructure/api/api';
import type { AuthResponse } from '@/infrastructure/interfaces/responses/auth.response';

export const checkAuthAction = async (
  deviceId: string
): Promise<AuthResponse> => {
  try {
    const { data } = await api.get<AuthResponse>('/auth/check-status', {
      headers: {
        'x-device-id': deviceId || '',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
      params: {
        _t: new Date().getTime(),
      },
    });
    return data;
  } catch (error) {
    throw new Error('Token expired or not valid', { cause: error });
  }
};
