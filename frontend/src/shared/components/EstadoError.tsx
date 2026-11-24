import { CircleX } from 'lucide-react';

export const EstadoError = ({ mensaje }: { mensaje: string }) =>
  <p role="alert" className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
    <CircleX className="size-5 shrink-0" aria-hidden />{mensaje}
  </p>;
