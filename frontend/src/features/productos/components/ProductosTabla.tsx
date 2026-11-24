import { createColumnHelper, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { Boxes, Pencil, Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import { TablaDatos } from '../../../shared/components/TablaDatos';
import { Button } from '../../../shared/ui/Button';
import { dinero } from '../../../shared/utils/formato';
import type { Producto } from '../types';

const col = createColumnHelper<Producto>();

interface Props {
  productos: Producto[];
  onEditar: (p: Producto) => void;
  onStock: (p: Producto) => void;
  onEliminar: (p: Producto) => void;
}

export const ProductosTabla = ({ productos, onEditar, onStock, onEliminar }: Props) => {
  const columnas = useMemo(() => [
    col.accessor('nombre', { header: 'Nombre', cell: (c) => <span className="font-medium">{c.getValue()}</span> }),
    col.accessor('categoria.nombre', { header: 'Categoría' }),
    col.accessor('precio_base', { header: 'Precio', cell: (c) => dinero(c.getValue()) }),
    col.accessor('stock', { header: 'Stock', cell: (c) => <span className={c.getValue() === 0 ? 'font-semibold text-red-700' : ''}>{c.getValue()}</span> }),
    col.accessor('disponible', { header: 'Disponible', cell: (c) => c.getValue()
      ? <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800">Sí</span>
      : <span className="rounded-full bg-stone-200 px-3 py-1 text-sm font-semibold text-stone-700">No</span> }),
    col.display({ id: 'acciones', header: 'Acciones', cell: ({ row: { original: p } }) => <div className="flex gap-1">
      <Button variante="icono" onClick={() => onEditar(p)} title="Editar">
        <Pencil className="size-4" aria-hidden /><span className="sr-only">Editar {p.nombre}</span></Button>
      <Button variante="icono" onClick={() => onStock(p)} title="Stock y disponibilidad">
        <Boxes className="size-4" aria-hidden /><span className="sr-only">Stock de {p.nombre}</span></Button>
      <Button variante="icono" className="hover:bg-red-50 hover:text-red-700" onClick={() => onEliminar(p)} title="Eliminar">
        <Trash2 className="size-4" aria-hidden /><span className="sr-only">Eliminar {p.nombre}</span></Button>
    </div> }),
  ], [onEditar, onStock, onEliminar]);
  const tabla = useReactTable({ data: productos, columns: columnas, getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), initialState: { pagination: { pageIndex: 0, pageSize: 10 } } });
  return <TablaDatos tabla={tabla} />;
};
