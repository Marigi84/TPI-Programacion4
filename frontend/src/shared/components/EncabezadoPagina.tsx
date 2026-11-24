import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export const EncabezadoPagina = ({ Icono, titulo, children }: { Icono: LucideIcon; titulo: string; children?: ReactNode }) =>
  <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
    <h1 className="flex items-center gap-3 text-3xl font-extrabold">
      <span className="grid size-11 place-items-center rounded-xl bg-orange-100 text-orange-700"><Icono className="size-6" aria-hidden /></span>
      {titulo}
    </h1>
    {children}
  </div>;
