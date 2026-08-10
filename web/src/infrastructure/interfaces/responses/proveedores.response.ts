import type { ErrorsDetails } from '@techlogistics/shared/interfaces/responses';

export interface ProveedoresResponse {
  status: string;
  message: string;
  data: Datum[];
  errors: ErrorsDetails[];
  pagination: Pagination;
}

export interface Datum {
  activo: boolean;
  id_proveedor: number;
  nombre_empresa: string;
  contacto: string;
  telefono: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  next: string;
  prev: null;
}
