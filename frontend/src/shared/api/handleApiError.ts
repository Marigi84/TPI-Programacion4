import axios from 'axios';

/** Convierte el `detail` de la API en un mensaje para mostrar en pantalla. */
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const detail: unknown = error.response?.data?.detail;
    if (typeof detail === 'string') return detail;
    if (!error.response) return 'No se pudo conectar con el servidor.';
    return 'Revisá los datos ingresados.';
  }
  return error instanceof Error ? error.message : 'Ocurrió un error.';
};
