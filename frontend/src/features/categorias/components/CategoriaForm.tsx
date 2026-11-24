import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { handleApiError } from '../../../shared/api/handleApiError';
import { Button } from '../../../shared/ui/Button';
import { Card } from '../../../shared/ui/Card';
import { Input } from '../../../shared/ui/Input';
import type { Categoria, CategoriaCreate } from '../types';

interface Props { categoria: Categoria | null; onGuardar: (datos: CategoriaCreate) => Promise<unknown>; onCancelar: () => void }

/** Crear y editar. Se remonta con `key` al cambiar la categoría editada. */
export const CategoriaForm = ({ categoria, onGuardar, onCancelar }: Props) => {
  const [error, setError] = useState('');
  const form = useForm({
    defaultValues: { nombre: categoria?.nombre ?? '', descripcion: categoria?.descripcion ?? '' },
    onSubmit: async ({ value, formApi }) => {
      try { setError(''); await onGuardar({ nombre: value.nombre.trim(), descripcion: value.descripcion }); formApi.reset(); }
      catch (causa) { setError(handleApiError(causa)); }
    },
  });

  return <Card className="mb-5">
    <h2 className="mb-3 text-xl font-bold">{categoria ? `Editar «${categoria.nombre}»` : 'Nueva categoría'}</h2>
    <form className="grid gap-3 sm:grid-cols-3" onSubmit={(e) => { e.preventDefault(); void form.handleSubmit(); }}>
      <form.Field name="nombre" validators={{ onChange: ({ value }) => {
        const largo = value.trim().length;
        return largo < 2 ? 'Mínimo 2 caracteres' : largo > 100 ? 'Máximo 100 caracteres' : undefined; } }}>
        {(f) => <Input label="Nombre" value={f.state.value} onBlur={f.handleBlur} onChange={(e) => f.handleChange(e.target.value)}
          errores={f.state.meta.isTouched ? f.state.meta.errors : []} />}
      </form.Field>
      <form.Field name="descripcion">
        {(f) => <Input label="Descripción" value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} />}
      </form.Field>
      <div className="flex items-end gap-2">
        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
          {([puede, enviando]) => <Button type="submit" disabled={!puede || enviando}>{categoria ? 'Guardar cambios' : 'Crear categoría'}</Button>}
        </form.Subscribe>
        {categoria && <Button variante="secundario" onClick={onCancelar}>Cancelar</Button>}
      </div>
      {error && <p role="alert" className="text-red-700 sm:col-span-3">{error}</p>}
    </form>
  </Card>;
};
