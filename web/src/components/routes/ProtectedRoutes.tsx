import { useAuthStore } from '@/stores/auth/useAuthStore';
import { Navigate, Outlet } from 'react-router-dom';

export const AuthenticatedRoute = () => {
  const { authStatus } = useAuthStore();

  if (authStatus === 'checking') return null;

  if (authStatus === 'not-authenticated') {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export const NotAuthenticatedRoute = () => {
  const { authStatus } = useAuthStore();

  if (authStatus === 'checking') return null;

  if (authStatus === 'authenticated') {
    return <Navigate replace to="/dashboard" />;
  }

  return <Outlet />;
};

export const AdminRoute = () => {
  const { authStatus, user } = useAuthStore();

  // Extraemos si el admin según el usuario en store, o del rol guardado previamente
  const isAdmin =
    user?.rol === 'ADMINISTRADOR' ||
    localStorage.getItem('rol') === 'ADMINISTRADOR';

  if (authStatus === 'checking') return null;

  if (authStatus === 'not-authenticated') {
    return <Navigate to="/login" />;
  }

  if (!isAdmin) return <Navigate to="/dashboard" />;

  return <Outlet />;
};

interface RoleRouteProps {
  allowedRoles: string[];
}

export const RoleRoute = ({ allowedRoles }: RoleRouteProps) => {
  const { authStatus, user } = useAuthStore();
  const userRole = user?.rol || localStorage.getItem('rol');

  if (authStatus === 'checking') return null;

  if (authStatus === 'not-authenticated') {
    return <Navigate to="/login" />;
  }

  // Si es ADMINISTRADOR, siempre dale pase. Si no, verifica si su rol está en la lista.
  if (
    userRole === 'ADMINISTRADOR' ||
    (userRole && allowedRoles.includes(userRole))
  ) {
    return <Outlet />;
  }

  if (userRole === 'OPERARIO') return <Navigate to="/terminal_operaciones" />;

  return <Navigate to="/dashboard" />;
};
