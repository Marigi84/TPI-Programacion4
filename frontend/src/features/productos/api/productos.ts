import { api } from '../../../shared/api/axiosInstance';
import type { Paginado } from '../../../shared/types/paginacion';
import type { FiltrosProductos, Producto, ProductoCreate, ProductoStockUpdate } from '../types';

export const listarProductos = async (filtros: FiltrosProductos): Promise<Paginado<Producto>> =>
  (await api.get<Paginado<Producto>>('/productos', { params: filtros })).data;
export const crearProducto = async (datos: ProductoCreate): Promise<Producto> =>
  (await api.post<Producto>('/productos', datos)).data;
export const actualizarProducto = async (id: number, datos: Partial<ProductoCreate>): Promise<Producto> =>
  (await api.put<Producto>(`/productos/${id}`, datos)).data;
export const cambiarStock = async (id: number, datos: ProductoStockUpdate): Promise<Producto> =>
  (await api.patch<Producto>(`/productos/${id}/stock`, datos)).data;
export const eliminarProducto = async (id: number): Promise<void> => { await api.delete(`/productos/${id}`); };
