import { api } from '@/infrastructure/api/api';

interface VerificacionResponse {
  status: 'success' | 'fail' | 'error';
  message: string;
}

export const logAccesoAction = async (
  id_usuario: number,
  dispositivo_id: string,
  estado: 'PERMITIDO' | 'DENEGADO',
  metodo_acceso: 'HUELLA' | 'PASSWORD'
): Promise<boolean> => {
  try {
    const { data } = await api.post<VerificacionResponse>(
      '/accesos-biometricos/verificar',
      {
        id_usuario,
        dispositivo_id,
        estado,
        metodo_acceso,
      }
    );

    return data.status === 'success';
  } catch (error: any) {
    console.error(
      'Error al registrar acceso biométrico:',
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || 'Error en la verificación biométrica.'
    );
  }
};
