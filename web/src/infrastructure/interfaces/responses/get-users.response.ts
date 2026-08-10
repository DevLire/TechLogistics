import type { ErrorsDetails } from '@techlogistics/shared/interfaces/responses';

export interface GetUsersResponse {
  status: string;
  message: string;
  data: Datum[];
  errors: ErrorsDetails[];
  pagination: Pagination;
}

export interface Datum {
  activo: boolean;
  id_usuario: number;
  nombre: string;
  email: string;
  rol: Role;
  puede_registrar_dispositivo: boolean;
  permite_fallback_password: boolean;
}

type Role = 'ADMINISTRADOR' | 'OPERARIO' | 'SUPERVISOR';

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  next: string;
  prev: string;
}
