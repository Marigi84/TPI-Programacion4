import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { actualizarProducto, cambiarStock, crearProducto, eliminarProducto, listarProductos } from '../api/productos';
import type { FiltrosProductos, ProductoCreate, ProductoStockUpdate } from '../types';

export const productosKeys = {
  todos: ['productos'] as const,
  lista: (filtros: FiltrosProductos) => ['productos', filtros] as const,
};

export const useProductos = (filtros: FiltrosProductos) => useQuery({
  queryKey: productosKeys.lista(filtros),
  queryFn: () => listarProductos(filtros),
  placeholderData: keepPreviousData, // evita parpadeos al cambiar de página
});

const useInvalidarProductos = () => {
  const client = useQueryClient();
  return () => { void client.invalidateQueries({ queryKey: productosKeys.todos }); };
};

export const useGuardarProducto = () => {
  const invalidar = useInvalidarProductos();
  return useMutation({
    mutationFn: ({ id, datos }: { id: number | null; datos: ProductoCreate }) =>
      (id === null ? crearProducto(datos) : actualizarProducto(id, datos)),
    onSuccess: invalidar,
  });
};

export const useCambiarStock = () => {
  const invalidar = useInvalidarProductos();
  return useMutation({
    mutationFn: ({ id, datos }: { id: number; datos: ProductoStockUpdate }) => cambiarStock(id, datos),
    onSuccess: invalidar,
  });
};

export const useEliminarProducto = () => {
  const invalidar = useInvalidarProductos();
  return useMutation({ mutationFn: eliminarProducto, onSuccess: invalidar });
};
