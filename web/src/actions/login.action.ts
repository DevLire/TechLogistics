import { api } from '@/api/api.ts';
import type { AuthResponse } from '@techlogistics/shared/interfaces/responses';

export const loginAction = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const { data } = await api.post<AuthResponse>('/auth/login', {
      email: email,
      password: password,
    });

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
