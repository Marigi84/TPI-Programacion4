import { createColumnHelper, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { Pencil, Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import { TablaDatos } from '../../../shared/components/TablaDatos';
import { Button } from '../../../shared/ui/Button';
import type { Categoria } from '../types';

const col = createColumnHelper<Categoria>();

interface Props { categorias: Categoria[]; onEditar: (c: Categoria) => void; onEliminar: (c: Categoria) => void }

export const CategoriasTabla = ({ categorias, onEditar, onEliminar }: Props) => {
  const columnas = useMemo(() => [
    col.accessor('nombre', { header: 'Nombre', cell: (c) => <span className="font-medium">{c.getValue()}</span> }),
    col.accessor('descripcion', { header: 'Descripción', cell: (c) => c.getValue() || <span className="text-stone-400">—</span> }),
    col.display({ id: 'acciones', header: 'Acciones', cell: ({ row }) => <div className="flex gap-1">
      <Button variante="icono" onClick={() => onEditar(row.original)} title="Editar">
        <Pencil className="size-4" aria-hidden /><span className="sr-only">Editar {row.original.nombre}</span></Button>
      <Button variante="icono" className="hover:bg-red-50 hover:text-red-700" onClick={() => onEliminar(row.original)} title="Eliminar">
        <Trash2 className="size-4" aria-hidden /><span className="sr-only">Eliminar {row.original.nombre}</span></Button>
    </div> }),
  ], [onEditar, onEliminar]);
  const tabla = useReactTable({ data: categorias, columns: columnas, getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), initialState: { pagination: { pageIndex: 0, pageSize: 10 } } });
  return <TablaDatos tabla={tabla} />;
};
