import { BadgeEstado } from '../../../shared/ui/BadgeEstado';
import { dinero, fecha } from '../../../shared/utils/formato';
import type { Pedido } from '../types';

export const PedidoDetalle = ({ pedido }: { pedido: Pedido }) => <div className="grid gap-3">
  <div className="flex items-center justify-between gap-3"><span>Pedido #{pedido.id}</span><BadgeEstado estado={pedido.estado} /></div>
  <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
    <dt className="font-semibold">Fecha</dt><dd>{fecha(pedido.created_at)}</dd>
    <dt className="font-semibold">Dirección</dt><dd>{pedido.direccion_entrega}</dd>
    <dt className="font-semibold">Pago</dt><dd>{pedido.forma_pago === 'EFECTIVO' ? 'Efectivo' : 'Transferencia'}</dd>
    {pedido.notas && <><dt className="font-semibold">Notas</dt><dd>{pedido.notas}</dd></>}
  </dl>
  <table className="w-full text-left text-sm">
    <thead><tr><th className="py-1">Producto</th><th>Cant.</th><th>Precio</th><th className="text-right">Subtotal</th></tr></thead>
    <tbody>{pedido.items.map((item) => <tr key={item.producto_id} className="border-t">
      <td className="py-1">{item.nombre_producto}</td><td>{item.cantidad}</td><td>{dinero(item.precio_unitario)}</td>
      <td className="text-right">{dinero(item.subtotal)}</td></tr>)}</tbody>
  </table>
  <p className="text-right text-lg font-bold">Total: {dinero(pedido.total)}</p>
</div>;
