import { api } from '@/core/api/api';

interface RegisterDeviceResponse {
  status: 'success' | 'fail' | 'error';
  message: string;
  data?: any;
}

export const registerDeviceAction = async (
  id_usuario: number,
  dispositivo_id: string,
  nombre_dispositivo: string
): Promise<boolean> => {
  try {
    const { data } = await api.post<RegisterDeviceResponse>('/dispositivos', {
      id_usuario,
      dispositivo_id,
      nombre_dispositivo,
    });

    return data.status === 'success';
  } catch (error: any) {
    console.error(
      'Error al registrar dispositivo:',
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || 'No se pudo registrar el terminal.'
    );
  }
};
