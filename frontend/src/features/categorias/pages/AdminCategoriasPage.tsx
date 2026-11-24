import { useState } from 'react';
import { Tags } from 'lucide-react';
import { EncabezadoPagina } from '../../../shared/components/EncabezadoPagina';
import { handleApiError } from '../../../shared/api/handleApiError';
import { EstadoError } from '../../../shared/components/EstadoError';
import { EstadoVacio } from '../../../shared/components/EstadoVacio';
import { Skeleton } from '../../../shared/components/Skeleton';
import { CategoriaForm } from '../components/CategoriaForm';
import { CategoriasTabla } from '../components/CategoriasTabla';
import { useCategorias, useEliminarCategoria, useGuardarCategoria } from '../hooks/useCategorias';
import type { Categoria } from '../types';

export const AdminCategoriasPage = () => {
  const [editando, setEditando] = useState<Categoria | null>(null);
  const categorias = useCategorias();
  const guardar = useGuardarCategoria();
  const eliminar = useEliminarCategoria();

  return <section>
    <EncabezadoPagina Icono={Tags} titulo="Categorías" />
    <CategoriaForm key={editando?.id ?? 'nueva'} categoria={editando} onCancelar={() => setEditando(null)}
      onGuardar={async (datos) => { await guardar.mutateAsync({ id: editando?.id ?? null, datos }); setEditando(null); }} />
    {categorias.isLoading ? <Skeleton /> : categorias.isError ? <EstadoError mensaje={handleApiError(categorias.error)} />
      : !categorias.data?.length ? <EstadoVacio>No hay categorías.</EstadoVacio>
      : <CategoriasTabla categorias={categorias.data} onEditar={setEditando}
          onEliminar={(c) => { if (window.confirm(`¿Dar de baja «${c.nombre}»?`)) eliminar.mutate(c.id); }} />}
    {eliminar.isError && <EstadoError mensaje={handleApiError(eliminar.error)} />}
  </section>;
};
