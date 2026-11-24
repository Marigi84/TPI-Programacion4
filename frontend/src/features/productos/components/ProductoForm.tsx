import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { handleApiError } from '../../../shared/api/handleApiError';
import { Button } from '../../../shared/ui/Button';
import { Card } from '../../../shared/ui/Card';
import { Input } from '../../../shared/ui/Input';
import type { Categoria } from '../../categorias/types';
import type { Producto, ProductoCreate } from '../types';

interface Props {
  producto: Producto | null;
  categorias: Categoria[];
  onGuardar: (datos: ProductoCreate) => Promise<unknown>;
  onCancelar: () => void;
}

const vacio: ProductoCreate = { nombre: '', descripcion: '', precio_base: 0, imagen_url: '', categoria_id: 0, stock: 0, disponible: true };

const desdeProducto = (p: Producto): ProductoCreate => ({ nombre: p.nombre, descripcion: p.descripcion,
  precio_base: p.precio_base, imagen_url: p.imagen_url, categoria_id: p.categoria_id, stock: p.stock, disponible: p.disponible });

/** Crear y editar. Se remonta con `key` al cambiar el producto editado. */
export const ProductoForm = ({ producto, categorias, onGuardar, onCancelar }: Props) => {
  const [error, setError] = useState('');
  const form = useForm({
    defaultValues: producto ? desdeProducto(producto) : vacio,
    onSubmit: async ({ value, formApi }) => {
      try { setError(''); await onGuardar({ ...value, nombre: value.nombre.trim() }); formApi.reset(); }
      catch (causa) { setError(handleApiError(causa)); }
    },
  });
  const errores = (meta: { isTouched: boolean; errors: unknown[] }) => (meta.isTouched ? meta.errors : []);

  return <Card className="mb-5">
    <h2 className="mb-3 text-xl font-bold">{producto ? `Editar «${producto.nombre}»` : 'Nuevo producto'}</h2>
    <form className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" onSubmit={(e) => { e.preventDefault(); void form.handleSubmit(); }}>
      <form.Field name="nombre" validators={{ onChange: ({ value }) => !value.trim() ? 'Ingresá el nombre' : undefined }}>
        {(f) => <Input label="Nombre" value={f.state.value} onBlur={f.handleBlur} onChange={(e) => f.handleChange(e.target.value)} errores={errores(f.state.meta)} />}
      </form.Field>
      <form.Field name="descripcion">
        {(f) => <Input label="Descripción" value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} />}
      </form.Field>
      <form.Field name="categoria_id" validators={{ onChange: ({ value }) => !value ? 'Elegí una categoría' : undefined }}>
        {(f) => <label className="grid gap-1.5"><span className="text-sm font-medium text-stone-700">Categoría</span>
          <select className="input" value={f.state.value || ''} onBlur={f.handleBlur} onChange={(e) => f.handleChange(Number(e.target.value))}>
            <option value="">Elegir</option>
            {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
          {f.state.meta.isTouched && f.state.meta.errors.length > 0 && <span className="text-sm text-red-700">{f.state.meta.errors.join(', ')}</span>}
        </label>}
      </form.Field>
      <form.Field name="precio_base" validators={{ onChange: ({ value }) => Number.isNaN(value) || value < 0 ? 'El precio debe ser mayor o igual a 0' : undefined }}>
        {(f) => <Input label="Precio" type="number" min="0" step="0.01" value={f.state.value} onBlur={f.handleBlur}
          onChange={(e) => f.handleChange(e.target.valueAsNumber)} errores={errores(f.state.meta)} />}
      </form.Field>
      <form.Field name="imagen_url">
        {(f) => <Input label="URL de imagen" type="url" value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} />}
      </form.Field>
      <form.Field name="stock" validators={{ onChange: ({ value }) => !Number.isInteger(value) || value < 0 ? 'El stock debe ser un entero mayor o igual a 0' : undefined }}>
        {(f) => <Input label="Stock" type="number" min="0" step="1" value={f.state.value} onBlur={f.handleBlur}
          onChange={(e) => f.handleChange(e.target.valueAsNumber)} errores={errores(f.state.meta)} />}
      </form.Field>
      <form.Field name="disponible">
        {(f) => <label className="flex items-center gap-2 self-end pb-2">
          <input type="checkbox" checked={f.state.value} onChange={(e) => f.handleChange(e.target.checked)} /> Disponible</label>}
      </form.Field>
      <div className="flex items-end gap-2">
        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
          {([puede, enviando]) => <Button type="submit" disabled={!puede || enviando}>{producto ? 'Guardar cambios' : 'Crear producto'}</Button>}
        </form.Subscribe>
        {producto && <Button variante="secundario" onClick={onCancelar}>Cancelar</Button>}
      </div>
      {error && <p role="alert" className="text-red-700 sm:col-span-2 lg:col-span-4">{error}</p>}
    </form>
  </Card>;
};
