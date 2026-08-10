import type { ErrorsDetails } from '@techlogistics/shared/interfaces/responses';

export interface GetMovimientosIngresosResponse {
  status: string;
  message: string;
  data: Datum[];
  errors: ErrorsDetails[];
  pagination: Pagination;
}

export interface Datum {
  id_movimiento_inventario: number;
  id_usuario: number;
  fecha_movimiento: Date;
  total: string;
  tipo: 'INGRESO';
  usuario: Usuario;
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
