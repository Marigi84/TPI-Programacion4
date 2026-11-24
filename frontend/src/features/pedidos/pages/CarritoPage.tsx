import { ArrowRight, ShoppingCart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ContadorCantidad } from '../../../shared/components/ContadorCantidad';
import { EstadoVacio } from '../../../shared/components/EstadoVacio';
import { Button } from '../../../shared/ui/Button';
import { Card } from '../../../shared/ui/Card';
import { dinero } from '../../../shared/utils/formato';
import { useCartStore } from '../../../store/cartStore';
import { useCarrito } from '../hooks/useCarrito';

export const CarritoPage = () => {
  const { items, sumar, restar } = useCarrito();
  const quitar = useCartStore((s) => s.quitar);
  const vaciar = useCartStore((s) => s.vaciar);
  const total = useCartStore((s) => s.total);

  if (!items.length) return <EstadoVacio>
    <p className="mb-3">Tu carrito está vacío.</p>
    <Link className="btn" to="/"><ShoppingCart className="size-4" aria-hidden />Ver el menú</Link>
  </EstadoVacio>;

  return <section>
    <h1 className="mb-6 flex items-center gap-3 text-3xl font-extrabold"><ShoppingCart className="size-8 text-orange-600" aria-hidden />Carrito</h1>
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="grid content-start gap-3">{items.map((item) => <Card className="flex flex-wrap items-center justify-between gap-4" key={item.producto_id}>
        <div className="min-w-40 flex-1">
          <h2 className="font-bold">{item.nombre}</h2>
          <p className="text-sm text-stone-500">{dinero(item.precio_unitario)} c/u</p>
        </div>
        <ContadorCantidad cantidad={item.cantidad} nombre={item.nombre} onSumar={() => sumar(item)} onRestar={() => restar(item)} />
        <strong className="w-32 text-right">{dinero(item.cantidad * item.precio_unitario)}</strong>
        <Button variante="icono" onClick={() => quitar(item.producto_id)}>
          <Trash2 className="size-5" aria-hidden /><span className="sr-only">Quitar {item.nombre}</span>
        </Button>
      </Card>)}</div>

      <Card className="h-fit lg:sticky lg:top-24">
        <h2 className="mb-4 text-lg font-bold">Resumen</h2>
        <div className="flex justify-between border-t border-stone-200 pt-4 text-xl font-extrabold">
          <span>Total</span><span className="text-orange-700">{dinero(total())}</span>
        </div>
        <Link to="/checkout" className="btn mt-5 w-full">Confirmar compra<ArrowRight className="size-4" aria-hidden /></Link>
        <Button variante="secundario" className="mt-2 w-full" onClick={vaciar}>Vaciar carrito</Button>
      </Card>
    </div>
  </section>;
};
