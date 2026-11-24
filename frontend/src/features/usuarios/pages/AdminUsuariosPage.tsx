import { Users } from 'lucide-react';
import { EncabezadoPagina } from '../../../shared/components/EncabezadoPagina';
import { handleApiError } from '../../../shared/api/handleApiError';
import { EstadoError } from '../../../shared/components/EstadoError';
import { EstadoVacio } from '../../../shared/components/EstadoVacio';
import { Skeleton } from '../../../shared/components/Skeleton';
import { useAuthStore } from '../../../store/authStore';
import { UsuariosTabla } from '../components/UsuariosTabla';
import { useCambiarEstadoUsuario, useUsuarios } from '../hooks/useUsuarios';

export const AdminUsuariosPage = () => {
  const actual = useAuthStore((s) => s.usuario);
  const usuarios = useUsuarios();
  const cambiar = useCambiarEstadoUsuario();

  return <section>
    <EncabezadoPagina Icono={Users} titulo="Usuarios" />
    {usuarios.isLoading ? <Skeleton /> : usuarios.isError ? <EstadoError mensaje={handleApiError(usuarios.error)} />
      : !usuarios.data?.length ? <EstadoVacio>No hay usuarios.</EstadoVacio>
      : <UsuariosTabla usuarios={usuarios.data} idSesion={actual?.id} onCambiar={cambiar.mutate} pendiente={cambiar.isPending} />}
    {cambiar.isError && <EstadoError mensaje={handleApiError(cambiar.error)} />}
  </section>;
};
