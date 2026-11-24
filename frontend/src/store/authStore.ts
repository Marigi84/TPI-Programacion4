import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as authApi from '../features/auth/api/auth';
import type { Usuario } from '../features/usuarios/types';

interface AuthState {
  usuario: Usuario | null;
  /** true mientras checkSession confirma la sesión con /auth/me. */
  cargando: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  limpiarSesion: () => void;
}

export const useAuthStore = create<AuthState>()(persist((set) => ({
  usuario: null,
  cargando: true,
  limpiarSesion: () => set({ usuario: null, cargando: false }),
  login: async (username, password) => {
    await authApi.login({ username, password });
    set({ usuario: await authApi.obtenerPerfil(), cargando: false });
  },
  logout: async () => {
    try { await authApi.logout(); } finally { set({ usuario: null, cargando: false }); }
  },
  checkSession: async () => {
    try { set({ usuario: await authApi.obtenerPerfil() }); }
    catch { set({ usuario: null }); }
    finally { set({ cargando: false }); }
  },
  // Solo se guarda el usuario (nombre, email y rol); nunca el token.
}), { name: 'foodstore-auth', partialize: (state) => ({ usuario: state.usuario }) }));
