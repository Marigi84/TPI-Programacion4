import { ShoppingCart } from 'lucide-react';
import { ContadorCantidad } from '../../../shared/components/ContadorCantidad';
import { Button } from '../../../shared/ui/Button';
import { dinero } from '../../../shared/utils/formato';
import type { Producto } from '../types';
import { ProductoImagen } from './ProductoImagen';

interface Props {
  producto: Producto;
  cantidadEnCarrito: number;
  onAgregar: () => void;
  onRestar: () => void;
}

export const ProductoCard = ({ producto, cantidadEnCarrito, onAgregar, onRestar }: Props) => {
  const vendible = producto.disponible && producto.stock > 0;
  const etiqueta = !producto.disponible ? 'No disponible' : producto.stock === 0 ? 'Sin stock' : null;

  return <article className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
    <div className="relative">
      <ProductoImagen url={producto.imagen_url} nombre={producto.nombre} categoria={producto.categoria.nombre} />
      <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-stone-700 shadow-sm">{producto.categoria.nombre}</span>
      {etiqueta && <span className="absolute top-3 right-3 rounded-full bg-stone-900/80 px-3 py-1 text-xs font-semibold text-white">{etiqueta}</span>}
    </div>
    <div className="flex flex-1 flex-col gap-2 p-5">
      <h2 className="text-lg font-bold">{producto.nombre}</h2>
      {producto.descripcion && <p className="text-sm text-stone-600">{producto.descripcion}</p>}
      <div className="mt-auto flex items-end justify-between gap-3 pt-3">
        <p className="text-2xl font-extrabold text-orange-700">{dinero(producto.precio_base)}</p>
        <p className="pb-1 text-xs text-stone-500">{vendible ? `Stock: ${producto.stock}` : 'Sin unidades para la venta'}</p>
      </div>
      <div className="flex h-11 items-center justify-center">
        {cantidadEnCarrito > 0
          ? <ContadorCantidad cantidad={cantidadEnCarrito} nombre={producto.nombre} onSumar={onAgregar} onRestar={onRestar} />
          : <Button className="w-full" disabled={!vendible} onClick={onAgregar}><ShoppingCart className="size-4" aria-hidden />Agregar al carrito</Button>}
      </div>
    </div>
  </article>;
};
