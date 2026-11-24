import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  errores?: unknown[];
}

/** Campo con etiqueta y errores de validación de TanStack Form. */
export const Input = ({ label, errores = [], className = '', ...props }: InputProps) => {
  const mensajes = errores.filter((e): e is string => typeof e === 'string');
  return <label className="grid gap-1.5">
    <span className="text-sm font-medium text-stone-700">{label}</span>
    <input className={`input ${mensajes.length ? 'border-red-400' : ''} ${className}`} aria-invalid={mensajes.length > 0} {...props} />
    {mensajes.length > 0 && <span className="text-sm text-red-700">{mensajes.join(', ')}</span>}
  </label>;
};
