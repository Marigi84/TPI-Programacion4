import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface ModalProps { abierto: boolean; titulo: string; onCerrar: () => void; children: ReactNode }

export const Modal = ({ abierto, titulo, onCerrar, children }: ModalProps) => {
  if (!abierto) return null;
  return <div className="fixed inset-0 z-40 flex items-center justify-center bg-stone-900/50 p-4 backdrop-blur-sm" onClick={onCerrar}>
    <div role="dialog" aria-modal="true" aria-label={titulo}
      className="card max-h-[90vh] w-full max-w-lg overflow-y-auto" onClick={(e) => e.stopPropagation()}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold">{titulo}</h2>
        <button type="button" onClick={onCerrar} className="rounded-lg p-1.5 text-stone-500 transition hover:bg-stone-100 hover:text-stone-900">
          <X className="size-5" aria-hidden /><span className="sr-only">Cerrar</span>
        </button>
      </div>
      {children}
    </div>
  </div>;
};
