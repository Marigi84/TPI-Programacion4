import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { Link, useNavigate } from 'react-router-dom';
import { useRegistro } from '../hooks/useRegistro';
import { handleApiError } from '../../../shared/api/handleApiError';
import { Button } from '../../../shared/ui/Button';
import { UserPlus } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { Input } from '../../../shared/ui/Input';
import type { UserCreate } from '../types';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const inicial: UserCreate = { username: '', full_name: '', email: '', password: '' };

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const registro = useRegistro();
  const form = useForm({
    defaultValues: inicial,
    onSubmit: async ({ value }) => {
      try { setError(''); await registro.mutateAsync(value); navigate('/login'); }
      catch (causa) { setError(handleApiError(causa)); }
    },
  });
  const errores = (meta: { isTouched: boolean; errors: unknown[] }) => (meta.isTouched ? meta.errors : []);

  return <AuthLayout titulo="Crear cuenta" subtitulo="Registrate para comprar en Food Store">
    <form className="grid gap-4" onSubmit={(e) => { e.preventDefault(); void form.handleSubmit(); }}>
      <form.Field name="username" validators={{ onChange: ({ value }) =>
        !value.trim() ? 'Ingresá un usuario' : value.length > 50 ? 'Máximo 50 caracteres' : undefined }}>
        {(f) => <Input label="Usuario" autoComplete="username" value={f.state.value} onBlur={f.handleBlur}
          onChange={(e) => f.handleChange(e.target.value)} errores={errores(f.state.meta)} />}
      </form.Field>
      <form.Field name="full_name" validators={{ onChange: ({ value }) => !value.trim() ? 'Ingresá tu nombre' : undefined }}>
        {(f) => <Input label="Nombre completo" autoComplete="name" value={f.state.value} onBlur={f.handleBlur}
          onChange={(e) => f.handleChange(e.target.value)} errores={errores(f.state.meta)} />}
      </form.Field>
      <form.Field name="email" validators={{ onChange: ({ value }) => !EMAIL.test(value) ? 'Ingresá un email válido' : undefined }}>
        {(f) => <Input label="Email" type="email" autoComplete="email" value={f.state.value} onBlur={f.handleBlur}
          onChange={(e) => f.handleChange(e.target.value)} errores={errores(f.state.meta)} />}
      </form.Field>
      <form.Field name="password" validators={{ onChange: ({ value }) => value.length < 8 ? 'Mínimo 8 caracteres' : undefined }}>
        {(f) => <Input label="Contraseña" type="password" autoComplete="new-password" value={f.state.value}
          onBlur={f.handleBlur} onChange={(e) => f.handleChange(e.target.value)} errores={errores(f.state.meta)} />}
      </form.Field>
      {error && <p role="alert" className="text-red-700">{error}</p>}
      <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
        {([puede, enviando]) => <Button type="submit" disabled={!puede || enviando}><UserPlus className="size-4" aria-hidden />{enviando ? 'Registrando...' : 'Registrarme'}</Button>}
      </form.Subscribe>
    </form>
    <p className="mt-5 text-center text-stone-600">¿Ya tenés cuenta? <Link to="/login" className="font-semibold text-orange-700 hover:underline">Iniciá sesión</Link></p>
  </AuthLayout>;
};
