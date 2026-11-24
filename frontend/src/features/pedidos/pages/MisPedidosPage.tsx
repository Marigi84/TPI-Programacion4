import { useState } from 'react';
import { Ban, ClipboardList, Eye } from 'lucide-react';
import { EncabezadoPagina } from '../../../shared/components/EncabezadoPagina';
import { handleApiError } from '../../../shared/api/handleApiError';
import { EstadoError } from '../../../shared/components/EstadoError';
import { EstadoVacio } from '../../../shared/components/EstadoVacio';
import { Paginacion } from '../../../shared/components/Paginacion';
import { Skeleton } from '../../../shared/components/Skeleton';
import { Button } from '../../../shared/ui/Button';
import { Modal } from '../../../shared/ui/Modal';
import { useAuthStore } from '../../../store/authStore';
import { PedidoDetalle } from '../components/PedidoDetalle';
import { PedidosTabla } from '../components/PedidosTabla';
import { useCancelarPedido, usePedidos } from '../hooks/usePedidos';
import type { Pedido } from '../types';

const POR_PAGINA = 10;
const LIMITE_ADMIN = 100;

export const MisPedidosPage = () => {
  const usuario = useAuthStore((s) => s.usuario);
  const esAdmin = usuario?.role === 'admin';
  const [pagina, setPagina] = useState(0);
  const [detalle, setDetalle] = useState<Pedido | null>(null);

  // GET /pedidos devuelve los pedidos propios para un cliente y TODOS para un admin (consigna).
  // Cliente: paginación en el servidor. Admin: se piden hasta 100 y se dejan solo los suyos;
  // los pedidos de todos se gestionan en Panel admin → Pedidos.
  const pedidos = usePedidos(esAdmin
    ? { skip: 0, limit: LIMITE_ADMIN }
    : { skip: pagina * POR_PAGINA, limit: POR_PAGINA });
  const cancelar = useCancelarPedido();

  const propios = esAdmin
    ? (pedidos.data?.items ?? []).filter((p) => p.usuario_id === usuario?.id)
    : pedidos.data?.items ?? [];
  const total = esAdmin ? propios.length : pedidos.data?.total ?? 0;
  const visibles = esAdmin ? propios.slice(pagina * POR_PAGINA, (pagina + 1) * POR_PAGINA) : propios;

  // Solo se cancelan pedidos propios en PENDIENTE (RN-04).
  const puedeCancelar = (p: Pedido) => p.estado === 'PENDIENTE' && p.usuario_id === usuario?.id;
  const confirmarCancelacion = (p: Pedido) => {
    if (window.confirm(`¿Cancelar el pedido #${p.id}?`)) cancelar.mutate(p.id, { onSuccess: () => setDetalle(null) });
  };
  const acciones = (p: Pedido) => <>
    <Button variante="enlace" onClick={() => setDetalle(p)}><Eye className="size-4" aria-hidden />Ver detalle</Button>
    {puedeCancelar(p) && <Button variante="peligro" className="px-3 py-1.5 text-sm" disabled={cancelar.isPending} onClick={() => confirmarCancelacion(p)}><Ban className="size-4" aria-hidden />Cancelar</Button>}
  </>;

  return <section>
    <EncabezadoPagina Icono={ClipboardList} titulo="Mis pedidos" />
    {pedidos.isLoading ? <Skeleton /> : pedidos.isError ? <EstadoError mensaje={handleApiError(pedidos.error)} />
      : !total ? <EstadoVacio>Aún no hiciste pedidos.</EstadoVacio>
      : <>
        <PedidosTabla pedidos={visibles} acciones={acciones} />
        <Paginacion pagina={pagina} totalPaginas={Math.ceil(total / POR_PAGINA)} onCambiar={setPagina} />
      </>}
    {cancelar.isError && <EstadoError mensaje={handleApiError(cancelar.error)} />}
    <Modal abierto={detalle !== null} titulo="Detalle del pedido" onCerrar={() => setDetalle(null)}>
      {detalle && <>
        <PedidoDetalle pedido={detalle} />
        {puedeCancelar(detalle) && <Button variante="peligro" className="mt-4" onClick={() => confirmarCancelacion(detalle)}><Ban className="size-4" aria-hidden />Cancelar pedido</Button>}
      </>}
    </Modal>
  </section>;
};
