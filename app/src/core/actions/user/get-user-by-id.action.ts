import { api } from '@/core/api/api';
import type { GetUserResponse } from '@/infrastructure/interfaces/responses/get-user.response';

export const getUserByIdAction = async (id: number) => {
  const { data } = await api.get<GetUserResponse>(`/users/${id}`);
  return data;
};
