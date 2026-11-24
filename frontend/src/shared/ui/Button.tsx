import type { ButtonHTMLAttributes } from 'react';

type Variante = 'primario' | 'secundario' | 'peligro' | 'enlace' | 'icono';
const estilos: Record<Variante, string> = {
  primario: 'btn',
  secundario: 'inline-flex items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2 font-semibold text-stone-800 transition hover:bg-stone-100 disabled:opacity-50',
  peligro: 'inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50',
  enlace: 'inline-flex items-center gap-1.5 rounded font-medium text-orange-700 transition hover:text-orange-900 hover:underline disabled:opacity-50',
  icono: 'inline-flex items-center justify-center rounded-lg p-2 text-stone-600 transition hover:bg-stone-100 hover:text-stone-900 disabled:opacity-40',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { variante?: Variante }

export const Button = ({ variante = 'primario', className = '', type = 'button', ...props }: ButtonProps) =>
  <button type={type} className={`${estilos[variante]} ${className}`} {...props} />;
