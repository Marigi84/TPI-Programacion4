import { Inbox } from 'lucide-react';
import type { ReactNode } from 'react';

export const EstadoVacio = ({ children }: { children: ReactNode }) =>
  <div className="card flex flex-col items-center gap-3 py-10 text-center text-stone-600">
    <Inbox className="size-10 text-stone-400" aria-hidden />
    <div>{children}</div>
  </div>;
