import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { handleApiError } from '../../../shared/api/handleApiError';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import type { FormaPago } from '../types';

export interface DatosCheckout { direccion_entrega: string; forma_pago: FormaPago; notas: string }

export const CheckoutForm = ({ onConfirmar }: { onConfirmar: (datos: DatosCheckout) => Promise<unknown> }) => {
  const [error, setError] = useState('');
  const form = useForm({
    defaultValues: { direccion_entrega: '', forma_pago: 'EFECTIVO', notas: '' } as DatosCheckout,
    onSubmit: async ({ value }) => {
      try { setError(''); await onConfirmar(value); } catch (causa) { setError(handleApiError(causa)); }
    },
  });

  return <form className="grid gap-3" onSubmit={(e) => { e.preventDefault(); void form.handleSubmit(); }}>
    <form.Field name="direccion_entrega" validators={{ onChange: ({ value }) => {
      const largo = value.trim().length;
      return largo < 5 ? 'La dirección debe tener al menos 5 caracteres' : largo > 200 ? 'Máximo 200 caracteres' : undefined; } }}>
      {(f) => <Input label="Dirección de entrega" maxLength={200} value={f.state.value} onBlur={f.handleBlur}
        onChange={(e) => f.handleChange(e.target.value)} errores={f.state.meta.isTouched ? f.state.meta.errors : []} />}
    </form.Field>
    <form.Field name="forma_pago">
      {(f) => <label className="grid gap-1.5"><span className="text-sm font-medium text-stone-700">Forma de pago</span>
        <select className="input" value={f.state.value} onChange={(e) => f.handleChange(e.target.value as FormaPago)}>
          <option value="EFECTIVO">Efectivo</option><option value="TRANSFERENCIA">Transferencia</option>
        </select></label>}
    </form.Field>
    <form.Field name="notas">
      {(f) => <label className="grid gap-1.5"><span className="text-sm font-medium text-stone-700">Notas (opcional)</span>
        <textarea className="input" value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} /></label>}
    </form.Field>
    {error && <p role="alert" className="text-red-700">{error}</p>}
    <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
      {([puede, enviando]) => <Button type="submit" disabled={!puede || enviando}>{enviando ? 'Confirmando...' : 'Confirmar pedido'}</Button>}
    </form.Subscribe>
  </form>;
};
