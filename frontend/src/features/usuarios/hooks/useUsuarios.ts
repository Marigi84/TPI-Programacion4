import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { activarUsuario, desactivarUsuario, listarUsuarios } from '../api/usuarios';
import type { Usuario } from '../types';

export const usuariosKeys = { todos: ['usuarios'] as const };

export const useUsuarios = () => useQuery({ queryKey: usuariosKeys.todos, queryFn: listarUsuarios });

/** Activa o desactiva según el estado actual del usuario. */
export const useCambiarEstadoUsuario = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (usuario: Usuario) => (usuario.disabled ? activarUsuario(usuario.id) : desactivarUsuario(usuario.id)),
    onSuccess: () => { void client.invalidateQueries({ queryKey: usuariosKeys.todos }); },
  });
};
