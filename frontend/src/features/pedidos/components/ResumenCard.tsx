import type { LucideIcon } from 'lucide-react';

interface Props { titulo: string; valor: string | number; Icono: LucideIcon; color: string }

/** color: clases de Tailwind para el ícono, p. ej. "bg-amber-100 text-amber-700". */
export const ResumenCard = ({ titulo, valor, Icono, color }: Props) =>
  <div className="card flex items-center gap-4">
    <span className={`grid size-12 shrink-0 place-items-center rounded-xl ${color}`}><Icono className="size-6" aria-hidden /></span>
    <div>
      <h2 className="text-sm font-medium text-stone-500">{titulo}</h2>
      <strong className="text-2xl font-extrabold">{valor}</strong>
    </div>
  </div>;
