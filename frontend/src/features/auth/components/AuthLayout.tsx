import { ChefHat } from 'lucide-react';
import type { ReactNode } from 'react';
import { Card } from '../../../shared/ui/Card';

/** Marco común de login y registro. */
export const AuthLayout = ({ titulo, subtitulo, children }: { titulo: string; subtitulo: string; children: ReactNode }) =>
  <div className="mx-auto max-w-md py-6">
    <div className="mb-6 text-center">
      <span className="mx-auto mb-3 grid size-14 place-items-center rounded-2xl bg-orange-600 text-white shadow-lg"><ChefHat className="size-8" aria-hidden /></span>
      <h1 className="text-2xl font-extrabold">{titulo}</h1>
      <p className="text-stone-600">{subtitulo}</p>
    </div>
    <Card className="p-6">{children}</Card>
  </div>;
