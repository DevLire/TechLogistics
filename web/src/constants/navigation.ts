export interface NavItem {
  text: string;
  to?: string;
  roles: Role[];
  children?: NavItem[];
}

type Role = 'ADMINISTRADOR' | 'SUPERVISOR' | 'OPERARIO';

export const routeList: NavItem[] = [
  {
    text: 'Dashboard',
    to: '/dashboard',
    roles: ['ADMINISTRADOR', 'SUPERVISOR'],
  },
  {
    text: 'Usuarios',
    to: '/usuarios',
    roles: ['ADMINISTRADOR'],
  },
  {
    text: 'Terminal de Operaciones',
    to: '/terminal_operaciones',
    roles: ['ADMINISTRADOR', 'OPERARIO', 'SUPERVISOR'],
  },
  {
    text: 'Productos',
    to: '/productos',
    roles: ['ADMINISTRADOR', 'OPERARIO'],
  },
  {
    text: 'Accesos al Almacén',
    to: '/accesos',
    roles: ['ADMINISTRADOR'],
  },
  {
    text: 'Proveedores',
    to: '/proveedores',
    roles: ['ADMINISTRADOR'],
  },
  {
    text: 'Categorías',
    to: '/categorias',
    roles: ['ADMINISTRADOR'],
  },
  {
    text: 'Historial de Movimientos',
    to: '/reportes',
    roles: ['ADMINISTRADOR', 'SUPERVISOR'],
  },
];
