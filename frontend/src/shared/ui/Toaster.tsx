import { CircleCheck, CircleX, TriangleAlert, X, type LucideIcon } from 'lucide-react';
import { useToastStore, type TipoToast } from '../../store/toastStore';

const estilos: Record<TipoToast, { clase: string; Icono: LucideIcon }> = {
  exito: { clase: 'border-emerald-200 bg-emerald-50 text-emerald-900', Icono: CircleCheck },
  aviso: { clase: 'border-amber-200 bg-amber-50 text-amber-900', Icono: TriangleAlert },
  error: { clase: 'border-red-200 bg-red-50 text-red-900', Icono: CircleX },
};

/** Se monta una sola vez, en MainLayout. */
export const Toaster = () => {
  const toasts = useToastStore((s) => s.toasts);
  const cerrar = useToastStore((s) => s.cerrar);

  return <div className="pointer-events-none fixed right-4 bottom-4 z-50 grid w-[min(24rem,calc(100vw-2rem))] gap-2" role="status" aria-live="polite">
    {toasts.map(({ id, mensaje, tipo }) => {
      const { clase, Icono } = estilos[tipo];
      return <div key={id} className={`pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg ${clase}`}>
        <Icono className="size-5 shrink-0" aria-hidden />
        <span className="flex-1 font-medium">{mensaje}</span>
        <button type="button" onClick={() => cerrar(id)} className="rounded p-1 opacity-70 transition hover:opacity-100">
          <X className="size-4" aria-hidden /><span className="sr-only">Cerrar aviso</span>
        </button>
      </div>;
    })}
  </div>;
};
