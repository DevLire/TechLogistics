import type { ErrorsDetails } from '@techlogistics/shared/interfaces/responses';

export interface GetDispositivosResponse {
  status: string;
  message: string;
  data: Datum[];
  errors: ErrorsDetails[];
  pagination: Pagination;
}

export interface Datum {
  id_dispositivo_autorizado: number;
  usuario: Usuario;
  dispositivo_id: string;
  nombre_dispositivo: string;
  fecha_registro: Date;
}

export interface Usuario {
  id_usuario: number;
  nombre: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  next: string;
  prev: string;
}
