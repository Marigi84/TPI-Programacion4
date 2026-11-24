import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productosKeys } from '../../productos/hooks/useProductos';
import { cambiarEstadoPedido, cancelarPedido, crearPedido, listarPedidos, obtenerResumen } from '../api/pedidos';
import type { EstadoPedido, FiltrosPedidos } from '../types';

export const pedidosKeys = {
  todos: ['pedidos'] as const,
  lista: (filtros: FiltrosPedidos) => ['pedidos', filtros] as const,
  resumen: ['pedidos', 'resumen'] as const,
};

export const usePedidos = (filtros: FiltrosPedidos) => useQuery({
  queryKey: pedidosKeys.lista(filtros), queryFn: () => listarPedidos(filtros), placeholderData: keepPreviousData,
});

export const useResumenPedidos = () => useQuery({ queryKey: pedidosKeys.resumen, queryFn: obtenerResumen });

/** Crear o cancelar un pedido cambia el stock: se invalidan pedidos (incluye resumen) y productos. */
const useInvalidarPedidosYStock = () => {
  const client = useQueryClient();
  return () => {
    void client.invalidateQueries({ queryKey: pedidosKeys.todos });
    void client.invalidateQueries({ queryKey: productosKeys.todos });
  };
};

export const useCrearPedido = () => useMutation({ mutationFn: crearPedido, onSuccess: useInvalidarPedidosYStock() });

export const useCambiarEstadoPedido = () => useMutation({
  mutationFn: ({ id, estado }: { id: number; estado: EstadoPedido }) => cambiarEstadoPedido(id, estado),
  onSuccess: useInvalidarPedidosYStock(),
});

export const useCancelarPedido = () => useMutation({ mutationFn: cancelarPedido, onSuccess: useInvalidarPedidosYStock() });
