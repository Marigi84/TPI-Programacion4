import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  withCredentials: true, // La cookie HttpOnly viaja sola; el frontend nunca lee el token.
});

const RUTAS_SIN_LIMPIEZA = /\/auth\/(token|me)$/;

api.interceptors.response.use((response) => response, (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const detail: unknown = error.response?.data?.detail;
    const sesionVencida = status === 401 && !RUTAS_SIN_LIMPIEZA.test(error.config?.url ?? '');
    const cuentaDesactivada = status === 400 && detail === 'Cuenta de usuario desactivada';
    // Al quedar sin usuario, ProtectedRoute redirige a /login.
    if (sesionVencida || cuentaDesactivada) useAuthStore.getState().limpiarSesion();
  }
  return Promise.reject(error);
});
