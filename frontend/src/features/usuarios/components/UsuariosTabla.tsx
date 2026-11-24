import { createColumnHelper, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { ShieldCheck, User, UserCheck, UserX } from 'lucide-react';
import { useMemo } from 'react';
import { TablaDatos } from '../../../shared/components/TablaDatos';
import { Button } from '../../../shared/ui/Button';
import { etiquetaRol, nombrePropio } from '../../../shared/utils/formato';
import type { Usuario } from '../types';

const col = createColumnHelper<Usuario>();

interface Props { usuarios: Usuario[]; idSesion: number | undefined; onCambiar: (u: Usuario) => void; pendiente: boolean }

export const UsuariosTabla = ({ usuarios, idSesion, onCambiar, pendiente }: Props) => {
  const columnas = useMemo(() => [
    col.accessor('username', { header: 'Usuario', cell: (c) => <span className="font-medium">{c.getValue()}</span> }),
    col.accessor('full_name', { header: 'Nombre', cell: (c) => nombrePropio(c.getValue()) }),
    col.accessor('email', { header: 'Email' }),
    col.accessor('role', { header: 'Rol', cell: (c) => {
      const Icono = c.getValue() === 'admin' ? ShieldCheck : User;
      return <span className="inline-flex items-center gap-1.5"><Icono className="size-4 text-stone-500" aria-hidden />{etiquetaRol(c.getValue())}</span>;
    } }),
    col.accessor('disabled', { header: 'Estado', cell: (c) => c.getValue()
      ? <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-800">Desactivado</span>
      : <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800">Activo</span> }),
    col.display({ id: 'acciones', header: 'Acción', cell: ({ row: { original: u } }) =>
      // El admin no puede desactivarse a sí mismo: el botón no se muestra en su fila.
      (u.id !== idSesion || u.disabled) && <Button disabled={pendiente} variante={u.disabled ? 'secundario' : 'peligro'}
        onClick={() => onCambiar(u)}>
        {u.disabled ? <UserCheck className="size-4" aria-hidden /> : <UserX className="size-4" aria-hidden />}
        {u.disabled ? 'Activar' : 'Desactivar'}</Button> }),
  ], [idSesion, onCambiar, pendiente]);
  const tabla = useReactTable({ data: usuarios, columns: columnas, getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), initialState: { pagination: { pageIndex: 0, pageSize: 10 } } });
  return <TablaDatos tabla={tabla} />;
};
