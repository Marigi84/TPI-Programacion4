import { Ban, Banknote, CalendarDays, CircleCheck, Clock, CookingPot, LayoutDashboard } from 'lucide-react';
import { handleApiError } from '../../../shared/api/handleApiError';
import { EncabezadoPagina } from '../../../shared/components/EncabezadoPagina';
import { EstadoError } from '../../../shared/components/EstadoError';
import { Skeleton } from '../../../shared/components/Skeleton';
import { dinero } from '../../../shared/utils/formato';
import { ResumenCard } from '../components/ResumenCard';
import { useResumenPedidos } from '../hooks/usePedidos';

export const AdminResumenPage = () => {
  const resumen = useResumenPedidos();
  if (resumen.isLoading) return <Skeleton cantidad={6} />;
  if (resumen.isError || !resumen.data) return <EstadoError mensaje={handleApiError(resumen.error)} />;
  const r = resumen.data;

  return <section>
    <EncabezadoPagina Icono={LayoutDashboard} titulo="Resumen del negocio" />
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <ResumenCard titulo="Pendientes" valor={r.pendientes} Icono={Clock} color="bg-amber-100 text-amber-700" />
      <ResumenCard titulo="En preparación" valor={r.en_preparacion} Icono={CookingPot} color="bg-sky-100 text-sky-700" />
      <ResumenCard titulo="Entregados" valor={r.entregados} Icono={CircleCheck} color="bg-emerald-100 text-emerald-700" />
      <ResumenCard titulo="Cancelados" valor={r.cancelados} Icono={Ban} color="bg-red-100 text-red-700" />
      <ResumenCard titulo="Pedidos de hoy" valor={r.pedidos_hoy} Icono={CalendarDays} color="bg-orange-100 text-orange-700" />
      <ResumenCard titulo="Ingresos entregados" valor={dinero(r.ingresos_entregados)} Icono={Banknote} color="bg-stone-200 text-stone-700" />
    </div>
  </section>;
};
