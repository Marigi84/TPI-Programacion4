import { Minus, Plus, Trash2 } from 'lucide-react';

interface Props {
  cantidad: number;
  nombre: string;
  onSumar: () => void;
  onRestar: () => void;
}

/** Selector − n +. En 1, el botón de restar muestra un tacho: quita el producto del carrito. */
export const ContadorCantidad = ({ cantidad, nombre, onSumar, onRestar }: Props) =>
  <div className="inline-flex items-center rounded-lg border border-orange-300 bg-orange-50">
    <button type="button" onClick={onRestar} className="rounded-l-lg p-2 text-orange-700 transition hover:bg-orange-100">
      {cantidad === 1 ? <Trash2 className="size-4" aria-hidden /> : <Minus className="size-4" aria-hidden />}
      <span className="sr-only">{cantidad === 1 ? `Quitar ${nombre} del carrito` : `Restar una unidad de ${nombre}`}</span>
    </button>
    <span className="min-w-10 text-center font-bold text-orange-900" aria-live="polite" aria-label={`Cantidad: ${cantidad}`}>{cantidad}</span>
    <button type="button" onClick={onSumar} className="rounded-r-lg p-2 text-orange-700 transition hover:bg-orange-100">
      <Plus className="size-4" aria-hidden /><span className="sr-only">Sumar una unidad de {nombre}</span>
    </button>
  </div>;
