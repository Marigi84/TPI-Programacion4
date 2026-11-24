import { Link, useNavigate } from 'react-router-dom';
import { ClipboardCheck } from 'lucide-react';
import { Card } from '../../../shared/ui/Card';
import { dinero } from '../../../shared/utils/formato';
import { useCartStore } from '../../../store/cartStore';
import { CheckoutForm, type DatosCheckout } from '../components/CheckoutForm';
import { useCrearPedido } from '../hooks/usePedidos';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, vaciar, total } = useCartStore();
  const crear = useCrearPedido();

  const confirmar = async ({ direccion_entrega, forma_pago, notas }: DatosCheckout) => {
    await crear.mutateAsync({ direccion_entrega: direccion_entrega.trim(), forma_pago, notas: notas.trim() || null,
      items: items.map(({ producto_id, cantidad }) => ({ producto_id, cantidad })) });
    vaciar();
    navigate('/mis-pedidos');
  };

  if (!items.length) return <Card>El carrito está vacío. <Link className="underline" to="/">Ver catálogo</Link></Card>;
  return <section className="mx-auto grid max-w-4xl gap-6 md:grid-cols-[1fr_18rem]">
    <Card className="p-6">
      <h1 className="mb-5 flex items-center gap-3 text-2xl font-extrabold"><ClipboardCheck className="size-7 text-orange-600" aria-hidden />Confirmar pedido</h1>
      <CheckoutForm onConfirmar={confirmar} />
    </Card>
    <Card className="h-fit">
      <h2 className="mb-3 font-bold">Tu pedido</h2>
      <ul className="grid gap-2 text-sm">{items.map((i) => <li key={i.producto_id} className="flex justify-between gap-3">
        <span>{i.cantidad} × {i.nombre}</span><span>{dinero(i.cantidad * i.precio_unitario)}</span></li>)}</ul>
      <p className="mt-4 flex justify-between border-t border-stone-200 pt-3 text-lg font-extrabold"><span>Total</span><span className="text-orange-700">{dinero(total())}</span></p>
    </Card>
  </section>;
};
