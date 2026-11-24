import { useState } from 'react';
import { Package } from 'lucide-react';
import { EncabezadoPagina } from '../../../shared/components/EncabezadoPagina';
import { handleApiError } from '../../../shared/api/handleApiError';
import { EstadoError } from '../../../shared/components/EstadoError';
import { EstadoVacio } from '../../../shared/components/EstadoVacio';
import { Skeleton } from '../../../shared/components/Skeleton';
import { useCategorias } from '../../categorias/hooks/useCategorias';
import { ProductoForm } from '../components/ProductoForm';
import { ProductosTabla } from '../components/ProductosTabla';
import { StockModal } from '../components/StockModal';
import { useCambiarStock, useEliminarProducto, useGuardarProducto, useProductos } from '../hooks/useProductos';
import type { Producto } from '../types';

export const AdminProductosPage = () => {
  const [editando, setEditando] = useState<Producto | null>(null);
  const [stockDe, setStockDe] = useState<Producto | null>(null);
  // El panel pide limit=100 y pagina del lado del cliente con TanStack Table.
  const productos = useProductos({ skip: 0, limit: 100 });
  const categorias = useCategorias();
  const guardar = useGuardarProducto();
  const stock = useCambiarStock();
  const eliminar = useEliminarProducto();

  return <section>
    <EncabezadoPagina Icono={Package} titulo="Productos y stock" />
    <ProductoForm key={editando?.id ?? 'nuevo'} producto={editando} categorias={categorias.data ?? []}
      onCancelar={() => setEditando(null)}
      onGuardar={async (datos) => { await guardar.mutateAsync({ id: editando?.id ?? null, datos }); setEditando(null); }} />
    {productos.isLoading ? <Skeleton /> : productos.isError ? <EstadoError mensaje={handleApiError(productos.error)} />
      : !productos.data?.total ? <EstadoVacio>No hay productos.</EstadoVacio>
      : <ProductosTabla productos={productos.data.items} onEditar={setEditando} onStock={setStockDe}
          onEliminar={(p) => { if (window.confirm(`¿Dar de baja «${p.nombre}»?`)) eliminar.mutate(p.id); }} />}
    {eliminar.isError && <EstadoError mensaje={handleApiError(eliminar.error)} />}
    <StockModal key={stockDe?.id ?? 'cerrado'} producto={stockDe} onCerrar={() => setStockDe(null)}
      onGuardar={(datos) => (stockDe ? stock.mutateAsync({ id: stockDe.id, datos }) : Promise.resolve())} />
  </section>;
};
