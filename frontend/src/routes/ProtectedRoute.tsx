import { Navigate, Outlet } from 'react-router-dom';
import type { Rol } from '../features/usuarios/types';
import { useAuthStore } from '../store/authStore';

/** Sin sesión redirige a /login; sin el rol, a /unauthorized. La protección real está en el
 * backend (require_role): ocultar pantallas no la reemplaza. */
export const ProtectedRoute = ({ roles }: { roles?: Rol[] }) => {
  const usuario = useAuthStore((s) => s.usuario);
  const cargando = useAuthStore((s) => s.cargando);
  if (cargando) return <p className="p-6" aria-busy="true">Verificando sesión...</p>;
  if (!usuario) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(usuario.role)) return <Navigate to="/unauthorized" replace />;
  return <Outlet />;
};
