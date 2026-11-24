import { useState } from 'react';
import { CupSoda, Hamburger, IceCreamCone, Pizza, UtensilsCrossed, type LucideIcon } from 'lucide-react';

const RELLENOS: { clave: string; Icono: LucideIcon; clase: string }[] = [
  { clave: 'pizza', Icono: Pizza, clase: 'from-orange-100 to-red-100 text-red-500' },
  { clave: 'hambur', Icono: Hamburger, clase: 'from-amber-100 to-orange-200 text-amber-700' },
  { clave: 'bebida', Icono: CupSoda, clase: 'from-sky-100 to-cyan-100 text-sky-600' },
  { clave: 'postre', Icono: IceCreamCone, clase: 'from-pink-100 to-rose-100 text-pink-500' },
];
const GENERICO = { Icono: UtensilsCrossed, clase: 'from-stone-100 to-orange-100 text-orange-600' };

/** Muestra imagen_url; si no hay o no carga, un fondo con el ícono de la categoría. */
export const ProductoImagen = ({ url, nombre, categoria }: { url: string; nombre: string; categoria: string }) => {
  const [rota, setRota] = useState(false);
  if (url && !rota) {
    return <img src={url} alt={nombre} onError={() => setRota(true)} className="h-40 w-full object-cover" />;
  }
  const { Icono, clase } = RELLENOS.find((r) => categoria.toLowerCase().includes(r.clave)) ?? GENERICO;
  return <div className={`grid h-40 w-full place-items-center bg-gradient-to-br ${clase}`} aria-hidden>
    <Icono className="size-16" strokeWidth={1.5} />
  </div>;
};
