import { api } from '../api/api';
import type { GetDispositivosResponse } from '@/infrastructure/interfaces/responses/get-dispositivos.response';

export type EstadoDispositivo = 'TODOS' | 'ACTIVOS' | 'INACTIVOS';

interface Options {
  limit?: number | string;
  page?: number | string;
  search?: string;
  estado?: EstadoDispositivo;
}

export const getDispositivosAction = async (options: Options) => {
  const { limit, page, search, estado } = options;

  const { data } = await api.get<GetDispositivosResponse>('/dispositivos', {
    params: {
      limit,
      page,
      search,
      estado,
    },
  });

  return data;
};

export const deleteDispositivoAction = async (id: number) => {
  const { data } = await api.delete(`/dispositivos/${id}`);
  return data;
};
