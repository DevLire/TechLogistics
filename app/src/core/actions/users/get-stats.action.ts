import { api } from '@/core/api/api';

export interface UserStats {
  ultimo_ingreso: string | null;
  movimientos_hoy: number;
}

interface StatsResponse {
  status: string;
  data: UserStats;
}

export const getUserStatsAction = async (): Promise<UserStats> => {
  try {
    const { data } = await api.get<StatsResponse>('/users/stats');

    return data.data;
  } catch (error) {
    console.error('Error obteniendo estadísticas del usuario:', error);
    throw error;
  }
};
