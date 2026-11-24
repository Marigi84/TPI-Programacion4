import { api } from '../../../shared/api/axiosInstance';
import type { Credenciales, UserCreate, Usuario } from '../types';

/** El login es un formulario OAuth2; la respuesta deja el JWT en la cookie HttpOnly. */
export const login = async ({ username, password }: Credenciales): Promise<void> => {
  await api.post('/auth/token', new URLSearchParams({ username, password }));
};
export const logout = async (): Promise<void> => { await api.post('/auth/logout'); };
export const obtenerPerfil = async (): Promise<Usuario> => (await api.get<Usuario>('/auth/me')).data;
export const registrar = async (datos: UserCreate): Promise<Usuario> =>
  (await api.post<Usuario>('/auth/register', datos)).data;
