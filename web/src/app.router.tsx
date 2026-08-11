import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import {
  AuthenticatedRoute,
  NotAuthenticatedRoute,
  AdminRoute,
  RoleRoute,
} from './components/routes/ProtectedRoutes';

export const appRouter = createBrowserRouter([
  {
    path: '/login',
    element: <NotAuthenticatedRoute />,
    children: [
      {
        index: true,
        lazy: async () => {
          const { default: Login } = await import('./pages/auth/Login');

          return {
            Component: Login,
          };
        },
      },
    ],
  },

  {
    element: <AuthenticatedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            index: true,
            element: <Navigate replace to="/dashboard" />,
          },

          // SUPERVISOR
          {
            element: <RoleRoute allowedRoles={['SUPERVISOR']} />,
            children: [
              {
                path: 'dashboard',
                lazy: async () => {
                  const { default: Dashboard } =
                    await import('./pages/dashboard/Dashboard');

                  return {
                    Component: Dashboard,
                  };
                },
              },
              {
                path: 'reportes',
                lazy: async () => {
                  const { default: Reportes } =
                    await import('./pages/reportes/Reportes');

                  return {
                    Component: Reportes,
                  };
                },
              },
            ],
          },

          // ADMINISTRADOR
          {
            element: <AdminRoute />,
            children: [
              {
                path: 'usuarios',
                lazy: async () => {
                  const { Usuarios } =
                    await import('./pages/usuarios/Usuarios');

                  return {
                    Component: Usuarios,
                  };
                },
              },
              {
                path: 'dispositivos',
                lazy: async () => {
                  const { default: Dispositivos } =
                    await import('./pages/dispositivos/Dispositivos');

                  return {
                    Component: Dispositivos,
                  };
                },
              },
              {
                path: 'proveedores',
                lazy: async () => {
                  const { default: Proveedores } =
                    await import('./pages/proveedores/Proveedores');

                  return {
                    Component: Proveedores,
                  };
                },
              },
              {
                path: 'categorias',
                lazy: async () => {
                  const { default: Categorias } =
                    await import('./pages/categorias/Categorias');

                  return {
                    Component: Categorias,
                  };
                },
              },
              {
                path: 'accesos',
                lazy: async () => {
                  const { Accesos } = await import('./pages/accesos/Accesos');

                  return {
                    Component: Accesos,
                  };
                },
              },
            ],
          },

          // OPERARIO + SUPERVISOR
          {
            element: <RoleRoute allowedRoles={['OPERARIO', 'SUPERVISOR']} />,
            children: [
              {
                path: 'terminal_operaciones',
                lazy: async () => {
                  const { default: TerminalOperaciones } =
                    await import('./pages/terminal_operaciones/TerminalOperaciones');

                  return {
                    Component: TerminalOperaciones,
                  };
                },
              },
              {
                path: 'productos',
                lazy: async () => {
                  const { default: Productos } =
                    await import('./pages/productos/Productos');

                  return {
                    Component: Productos,
                  };
                },
              },
            ],
          },
        ],
      },
    ],
  },

  // Fallback
  {
    path: '*',
    element: <Navigate replace to="/login" />,
  },
]);
