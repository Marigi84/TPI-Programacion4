import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { actualizarCategoria, crearCategoria, eliminarCategoria, listarCategorias } from '../api/categorias';
import type { CategoriaCreate } from '../types';

export const categoriasKeys = { todas: ['categorias'] as const };

export const useCategorias = () => useQuery({ queryKey: categoriasKeys.todas, queryFn: listarCategorias });

export const useGuardarCategoria = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, datos }: { id: number | null; datos: CategoriaCreate }) =>
      (id === null ? crearCategoria(datos) : actualizarCategoria(id, datos)),
    onSuccess: () => { void client.invalidateQueries({ queryKey: categoriasKeys.todas }); },
  });
};

export const useEliminarCategoria = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: eliminarCategoria,
    onSuccess: () => { void client.invalidateQueries({ queryKey: categoriasKeys.todas }); },
  });
};
