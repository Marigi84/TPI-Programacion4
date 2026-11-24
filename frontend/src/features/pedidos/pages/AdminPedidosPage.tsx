import { useState } from 'react';
import { Ban, CircleCheck, ClipboardList, CookingPot, Eye, type LucideIcon } from 'lucide-react';
import { EncabezadoPagina } from '../../../shared/components/EncabezadoPagina';
import { handleApiError } from '../../../shared/api/handleApiError';
import { EstadoError } from '../../../shared/components/EstadoError';
import { EstadoVacio } from '../../../shared/components/EstadoVacio';
import { Skeleton } from '../../../shared/components/Skeleton';
import { Button } from '../../../shared/ui/Button';
import { Modal } from '../../../shared/ui/Modal';
import { PedidoDetalle } from '../components/PedidoDetalle';
import { PedidosTabla } from '../components/PedidosTabla';
import { useCambiarEstadoPedido, usePedidos } from '../hooks/usePedidos';
import { ESTADOS, TRANSICIONES, type EstadoPedido, type Pedido } from '../types';

const ACCIONES: Record<EstadoPedido, { texto: string; Icono: LucideIcon }> = {
  PENDIENTE: { texto: 'Pendiente', Icono: ClipboardList },
  EN_PREPARACION: { texto: 'Preparar', Icono: CookingPot },
  ENTREGADO: { texto: 'Entregar', Icono: CircleCheck },
  CANCELADO: { texto: 'Cancelar', Icono: Ban },
};

export const AdminPedidosPage = () => {
  const [estado, setEstado] = useState<EstadoPedido | undefined>();
  const [detalle, setDetalle] = useState<Pedido | null>(null);
  const pedidos = usePedidos({ skip: 0, limit: 100, estado });
  const cambiar = useCambiarEstadoPedido();

  // Solo se ofrecen las transiciones válidas de la máquina de estados.
  const acciones = (p: Pedido) => <>
    <Button variante="enlace" onClick={() => setDetalle(p)}><Eye className="size-4" aria-hidden />Ver</Button>
    {TRANSICIONES[p.estado].map((nuevo) => { const { texto, Icono } = ACCIONES[nuevo]; return <Button key={nuevo} className="px-3 py-1.5 text-sm" variante={nuevo === 'CANCELADO' ? 'peligro' : 'primario'}
      disabled={cambiar.isPending} onClick={() => {
        if (nuevo !== 'CANCELADO' || window.confirm(`¿Cancelar el pedido #${p.id}? Se restituye el stock.`))
          cambiar.mutate({ id: p.id, estado: nuevo });
      }}><Icono className="size-4" aria-hidden />{texto}</Button>; })}
  </>;

  return <section>
    <EncabezadoPagina Icono={ClipboardList} titulo="Gestión de pedidos">
    <select className="input max-w-xs" aria-label="Filtrar por estado" value={estado ?? ''}
      onChange={(e) => setEstado(e.target.value ? e.target.value as EstadoPedido : undefined)}>
      <option value="">Todos los estados</option>
      {ESTADOS.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
    </select>
    </EncabezadoPagina>
    {pedidos.isLoading ? <Skeleton /> : pedidos.isError ? <EstadoError mensaje={handleApiError(pedidos.error)} />
      : !pedidos.data?.total ? <EstadoVacio>No hay pedidos.</EstadoVacio>
      : <PedidosTabla pedidos={pedidos.data.items} mostrarCliente paginarEnCliente acciones={acciones} />}
    {cambiar.isError && <EstadoError mensaje={handleApiError(cambiar.error)} />}
    <Modal abierto={detalle !== null} titulo="Detalle del pedido" onCerrar={() => setDetalle(null)}>
      {detalle && <PedidoDetalle pedido={detalle} />}
    </Modal>
  </section>;
};
