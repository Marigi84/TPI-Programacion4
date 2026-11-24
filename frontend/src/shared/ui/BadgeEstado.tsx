import { Ban, CircleCheck, Clock, CookingPot, type LucideIcon } from 'lucide-react';
import type { EstadoPedido } from '../../features/pedidos/types';

const estilos: Record<EstadoPedido, { clase: string; texto: string; Icono: LucideIcon }> = {
  PENDIENTE: { clase: 'bg-amber-100 text-amber-800', texto: 'Pendiente', Icono: Clock },
  EN_PREPARACION: { clase: 'bg-sky-100 text-sky-800', texto: 'En preparación', Icono: CookingPot },
  ENTREGADO: { clase: 'bg-emerald-100 text-emerald-800', texto: 'Entregado', Icono: CircleCheck },
  CANCELADO: { clase: 'bg-red-100 text-red-800', texto: 'Cancelado', Icono: Ban },
};

export const BadgeEstado = ({ estado }: { estado: EstadoPedido }) => {
  const { clase, texto, Icono } = estilos[estado];
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold whitespace-nowrap ${clase}`}>
    <Icono className="size-4" aria-hidden />{texto}
  </span>;
};
