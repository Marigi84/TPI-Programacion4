import { createColumnHelper, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo, type ReactNode } from 'react';
import { TablaDatos } from '../../../shared/components/TablaDatos';
import { BadgeEstado } from '../../../shared/ui/BadgeEstado';
import { dinero, fecha } from '../../../shared/utils/formato';
import type { Pedido } from '../types';

const col = createColumnHelper<Pedido>();

interface Props {
  pedidos: Pedido[];
  mostrarCliente?: boolean;
  /** La paginación es del servidor en "Mis pedidos" y del cliente en el panel. */
  paginarEnCliente?: boolean;
  acciones: (pedido: Pedido) => ReactNode;
}

export const PedidosTabla = ({ pedidos, mostrarCliente = false, paginarEnCliente = false, acciones }: Props) => {
  const columnas = useMemo(() => [
    col.accessor('id', { header: 'N.º' }),
    ...(mostrarCliente ? [col.accessor('usuario_id', { header: 'Cliente ID' })] : []),
    col.accessor('created_at', { header: 'Fecha', cell: (c) => fecha(c.getValue()) }),
    col.accessor('estado', { header: 'Estado', cell: (c) => <BadgeEstado estado={c.getValue()} /> }),
    col.accessor('total', { header: 'Total', cell: (c) => dinero(c.getValue()) }),
    col.display({ id: 'acciones', header: 'Acciones', cell: ({ row }) => <div className="flex flex-wrap gap-2">{acciones(row.original)}</div> }),
  ], [mostrarCliente, acciones]);
  const tabla = useReactTable({ data: pedidos, columns: columnas, getCoreRowModel: getCoreRowModel(),
    ...(paginarEnCliente ? { getPaginationRowModel: getPaginationRowModel() } : {}),
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } } });
  return <TablaDatos tabla={tabla} paginar={paginarEnCliente} />;
};
