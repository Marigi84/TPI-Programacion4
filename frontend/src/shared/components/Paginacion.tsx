import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface PaginacionProps { pagina: number; totalPaginas: number; onCambiar: (pagina: number) => void }

/** pagina empieza en 0. */
export const Paginacion = ({ pagina, totalPaginas, onCambiar }: PaginacionProps) =>
  <div className="flex items-center justify-center gap-3 py-4">
    <Button variante="secundario" disabled={pagina <= 0} onClick={() => onCambiar(pagina - 1)}>
      <ChevronLeft className="size-4" aria-hidden />Anterior</Button>
    <span className="text-stone-600">Página {pagina + 1} de {Math.max(1, totalPaginas)}</span>
    <Button variante="secundario" disabled={pagina + 1 >= totalPaginas} onClick={() => onCambiar(pagina + 1)}>
      Siguiente<ChevronRight className="size-4" aria-hidden /></Button>
  </div>;
