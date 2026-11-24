import { useCartStore, type CartItem } from '../../../store/cartStore';
import { useToastStore } from '../../../store/toastStore';
import type { Producto } from '../../productos/types';

/** Acciones del carrito con sus avisos. Las usan el catálogo y la página del carrito. */
export const useCarrito = () => {
  const items = useCartStore((s) => s.items);
  const { agregar, cambiarCantidad, quitar } = useCartStore.getState();
  const mostrar = useToastStore((s) => s.mostrar);

  const cantidadDe = (productoId: number) => items.find((i) => i.producto_id === productoId)?.cantidad ?? 0;
  const avisoStock = (nombre: string, stock: number) =>
    mostrar(`Solo hay ${stock} ${stock === 1 ? 'unidad' : 'unidades'} de ${nombre}`, 'aviso');

  /** Desde el catálogo: usa el stock actual del producto. */
  const agregarProducto = (producto: Producto) => {
    const actual = cantidadDe(producto.id);
    if (actual >= producto.stock) { avisoStock(producto.nombre, producto.stock); return; }
    agregar(producto);
    if (actual === 0) mostrar(`Se agregó ${producto.nombre} al carrito`);
  };

  /** Desde el carrito: usa el stock visto al agregar; el backend vuelve a validar al confirmar. */
  const sumar = (item: CartItem) => {
    if (item.cantidad >= item.stock) { avisoStock(item.nombre, item.stock); return; }
    cambiarCantidad(item.producto_id, item.cantidad + 1);
  };

  const restar = (item: CartItem) => {
    if (item.cantidad > 1) { cambiarCantidad(item.producto_id, item.cantidad - 1); return; }
    quitar(item.producto_id);
    mostrar(`Se quitó ${item.nombre} del carrito`);
  };

  return { items, cantidadDe, agregarProducto, sumar, restar };
};
