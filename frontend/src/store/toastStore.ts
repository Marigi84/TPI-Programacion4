import { create } from 'zustand';

export type TipoToast = 'exito' | 'aviso' | 'error';

export interface Toast { id: number; mensaje: string; tipo: TipoToast }

interface ToastState {
  toasts: Toast[];
  mostrar: (mensaje: string, tipo?: TipoToast) => void;
  cerrar: (id: number) => void;
}

const DURACION_MS = 3000;
let siguienteId = 1;

/** Avisos temporales de la interfaz. Es estado del cliente, por eso vive en Zustand (sin persist). */
export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],
  mostrar: (mensaje, tipo = 'exito') => {
    const id = siguienteId++;
    // Máximo 3 a la vista: si se acumulan, se descarta el más viejo.
    set((state) => ({ toasts: [...state.toasts.slice(-2), { id, mensaje, tipo }] }));
    setTimeout(() => get().cerrar(id), DURACION_MS);
  },
  cerrar: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
