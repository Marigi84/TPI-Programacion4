export type { Usuario } from '../../usuarios/types';

/** Mismos campos que UserCreate del backend. */
export interface UserCreate { username: string; full_name: string; email: string; password: string }
export interface Credenciales { username: string; password: string }
