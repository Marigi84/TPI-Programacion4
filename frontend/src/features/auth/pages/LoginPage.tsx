import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { handleApiError } from '../../../shared/api/handleApiError';
import { Button } from '../../../shared/ui/Button';
import { LogIn } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { Input } from '../../../shared/ui/Input';

export const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [error, setError] = useState('');
  const form = useForm({
    defaultValues: { username: '', password: '' },
    onSubmit: async ({ value }) => {
      try { setError(''); await login(value.username, value.password); navigate('/'); }
      catch (causa) { setError(handleApiError(causa)); }
    },
  });

  return <AuthLayout titulo="Iniciar sesión" subtitulo="Ingresá para hacer tu pedido">
    <form onSubmit={(e) => { e.preventDefault(); void form.handleSubmit(); }} className="grid gap-4">
      <form.Field name="username" validators={{ onChange: ({ value }) => !value.trim() ? 'Ingresá el usuario' : undefined }}>
        {(f) => <Input label="Usuario" autoComplete="username" value={f.state.value} onBlur={f.handleBlur}
          onChange={(e) => f.handleChange(e.target.value)} errores={f.state.meta.isTouched ? f.state.meta.errors : []} />}
      </form.Field>
      <form.Field name="password" validators={{ onChange: ({ value }) => !value ? 'Ingresá la contraseña' : undefined }}>
        {(f) => <Input label="Contraseña" type="password" autoComplete="current-password" value={f.state.value}
          onBlur={f.handleBlur} onChange={(e) => f.handleChange(e.target.value)} errores={f.state.meta.isTouched ? f.state.meta.errors : []} />}
      </form.Field>
      {error && <p role="alert" className="text-red-700">{error}</p>}
      <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
        {([puede, enviando]) => <Button type="submit" disabled={!puede || enviando}><LogIn className="size-4" aria-hidden />{enviando ? 'Ingresando...' : 'Ingresar'}</Button>}
      </form.Subscribe>
    </form>
    <p className="mt-5 text-center text-stone-600">¿No tenés cuenta? <Link className="font-semibold text-orange-700 hover:underline" to="/register">Registrate</Link></p>
  </AuthLayout>;
};
