import type { ErrorsDetails } from '@/infrastructure/interfaces/error-details.interfaces.ts';

export interface GetUserResponse {
  status: string;
  message: string;
  errors: ErrorsDetails[];
  data: UserData;
}

export interface UserData {
  id_usuario: number;
  nombre: string;
  rol: Role;
  email: string;
  puede_registrar_dispositivo: boolean;
  permite_fallback_password: boolean;
}

type Role = 'ADMINISTRADOR' | 'OPERARIO' | 'SUPERVISOR';
