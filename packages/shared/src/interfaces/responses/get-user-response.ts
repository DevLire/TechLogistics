import type { ErrorsDetails } from './error-details';

export interface GetUserResponse {
  status: string;
  message: string;
  data: UserData;
  errors: ErrorsDetails[];
}

export interface UserData {
  id_usuario:                  number;
  nombre:                      string;
  rol:                         Role;
  email:                       string;
  activo:                      boolean;
  puede_registrar_dispositivo: boolean;
  permite_fallback_password:   boolean;
  dispositivos:                Dispositivo[];
}

export interface Dispositivo {
  id_dispositivo_autorizado: number;
  id_usuario:                number;
  dispositivo_id:            string;
  nombre_dispositivo:        string;
  fecha_registro:            Date;
  activo:                    boolean;
}

type Role = 'ADMINISTRADOR' | 'OPERARIO' | 'SUPERVISOR';
