export interface UserInterface {
  id_usuario: number;
  nombre: string;
  rol: string;
  email: string;
  password?: string;
  activo: boolean;
  puede_registrar_dispositivo: boolean;
  permite_fallback_password: boolean;
}