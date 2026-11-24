import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { handleApiError } from '../../../shared/api/handleApiError';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { Modal } from '../../../shared/ui/Modal';
import type { Producto, ProductoStockUpdate } from '../types';

interface Props { producto: Producto | null; onGuardar: (datos: ProductoStockUpdate) => Promise<unknown>; onCerrar: () => void }

export const StockModal = ({ producto, onGuardar, onCerrar }: Props) => {
  const [error, setError] = useState('');
  const form = useForm({
    defaultValues: { stock: producto?.stock ?? 0, disponible: producto?.disponible ?? true },
    onSubmit: async ({ value }) => {
      try { setError(''); await onGuardar(value); onCerrar(); } catch (causa) { setError(handleApiError(causa)); }
    },
  });

  return <Modal abierto={producto !== null} titulo={`Stock de ${producto?.nombre ?? ''}`} onCerrar={onCerrar}>
    <form className="grid gap-3" onSubmit={(e) => { e.preventDefault(); void form.handleSubmit(); }}>
      <form.Field name="stock" validators={{ onChange: ({ value }) => !Number.isInteger(value) || value < 0 ? 'Debe ser un entero mayor o igual a 0' : undefined }}>
        {(f) => <Input label="Stock" type="number" min="0" step="1" value={f.state.value}
          onChange={(e) => f.handleChange(e.target.valueAsNumber)} errores={f.state.meta.errors} />}
      </form.Field>
      <form.Field name="disponible">
        {(f) => <label className="flex items-center gap-2"><input type="checkbox" checked={f.state.value}
          onChange={(e) => f.handleChange(e.target.checked)} /> Disponible para la venta</label>}
      </form.Field>
      {error && <p role="alert" className="text-red-700">{error}</p>}
      <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
        {([puede, enviando]) => <Button type="submit" disabled={!puede || enviando}>Guardar</Button>}
      </form.Subscribe>
    </form>
  </Modal>;
};
