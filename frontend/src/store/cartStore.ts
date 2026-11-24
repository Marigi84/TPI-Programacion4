import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Producto } from '../features/productos/types';

export interface CartItem {
  producto_id: number;
  nombre: string;
  precio_unitario: number;
  cantidad: number;
  /** Stock visto al agregar: limita la cantidad en el carrito; el backend vuelve a validar. */
  stock: number;
}

interface CartState {
  items: CartItem[];
  agregar: (producto: Producto) => void;
  quitar: (productoId: number) => void;
  cambiarCantidad: (productoId: number, cantidad: number) => void;
  vaciar: () => void;
  total: () => number;
}

const limitar = (cantidad: number, stock: number) => Math.max(1, Math.min(cantidad, stock));

export const useCartStore = create<CartState>()(persist((set, get) => ({
  items: [],
  agregar: (producto) => set((state) => {
    const actual = state.items.find((item) => item.producto_id === producto.id);
    if (actual) return { items: state.items.map((item) => item.producto_id === producto.id
      ? { ...item, stock: producto.stock, cantidad: limitar(item.cantidad + 1, producto.stock) } : item) };
    return { items: [...state.items, { producto_id: producto.id, nombre: producto.nombre,
      precio_unitario: producto.precio_base, cantidad: 1, stock: producto.stock }] };
  }),
  quitar: (productoId) => set((state) => ({ items: state.items.filter((i) => i.producto_id !== productoId) })),
  cambiarCantidad: (productoId, cantidad) => set((state) => ({ items: state.items.map((item) =>
    item.producto_id === productoId ? { ...item, cantidad: limitar(cantidad, item.stock) } : item) })),
  vaciar: () => set({ items: [] }),
  total: () => get().items.reduce((suma, item) => suma + item.cantidad * item.precio_unitario, 0),
}), { name: 'foodstore-cart' }));
