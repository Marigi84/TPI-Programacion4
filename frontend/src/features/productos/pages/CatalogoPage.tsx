import { useState } from 'react';
import { Search } from 'lucide-react';
import { handleApiError } from '../../../shared/api/handleApiError';
import { EstadoError } from '../../../shared/components/EstadoError';
import { EstadoVacio } from '../../../shared/components/EstadoVacio';
import { Paginacion } from '../../../shared/components/Paginacion';
import { Skeleton } from '../../../shared/components/Skeleton';
import { useCategorias } from '../../categorias/hooks/useCategorias';
import { useCarrito } from '../../pedidos/hooks/useCarrito';
import { ProductoCard } from '../components/ProductoCard';
import { useProductos } from '../hooks/useProductos';

const POR_PAGINA = 9;

export const CatalogoPage = () => {
  const [search, setSearch] = useState('');
  const [categoriaId, setCategoriaId] = useState<number | undefined>();
  const [pagina, setPagina] = useState(0);
  const { items, agregarProducto, restar } = useCarrito();
  const categorias = useCategorias();
  // Paginación en el servidor: skip = página × limit.
  const productos = useProductos({ skip: pagina * POR_PAGINA, limit: POR_PAGINA,
    search: search.trim() || undefined, categoria_id: categoriaId });

  return <section>
    <div className="mb-8 rounded-3xl bg-gradient-to-br from-orange-600 to-red-600 p-8 text-white shadow-lg">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Nuestro menú</h1>
      <p className="mt-2 max-w-xl text-orange-50">Elegí tus comidas favoritas, armá tu pedido y recibilo en tu casa. Pagás en efectivo o por transferencia.</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Buscar</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-stone-400" aria-hidden />
          <input className="input py-3 pl-10 text-stone-900" placeholder="Buscar comidas" aria-label="Buscar" value={search}
            onChange={(e) => { setSearch(e.target.value); setPagina(0); }} />
        </label>
        <select className="input py-3 text-stone-900 sm:max-w-xs" aria-label="Categoría" value={categoriaId ?? ''}
          onChange={(e) => { setCategoriaId(e.target.value ? Number(e.target.value) : undefined); setPagina(0); }}>
          <option value="">Todas las categorías</option>
          {categorias.data?.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
      </div>
    </div>

    {productos.isLoading ? <Skeleton cantidad={6} /> : productos.isError ? <EstadoError mensaje={handleApiError(productos.error)} />
      : !productos.data?.total ? <EstadoVacio>No hay productos para mostrar.</EstadoVacio>
      : <>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {productos.data.items.map((p) => {
            const item = items.find((i) => i.producto_id === p.id);
            return <ProductoCard key={p.id} producto={p} cantidadEnCarrito={item?.cantidad ?? 0}
              onAgregar={() => agregarProducto(p)} onRestar={() => { if (item) restar(item); }} />;
          })}
        </div>
        <Paginacion pagina={pagina} totalPaginas={Math.ceil(productos.data.total / POR_PAGINA)} onCambiar={setPagina} />
      </>}
  </section>;
};
