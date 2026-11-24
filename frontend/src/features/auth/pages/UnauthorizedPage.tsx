import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../../shared/ui/Card';

export const UnauthorizedPage = () => <Card className="mx-auto flex max-w-lg flex-col items-center gap-3 py-10 text-center">
  <ShieldAlert className="size-12 text-orange-600" aria-hidden />
  <h1 className="text-2xl font-extrabold">Sin permiso</h1>
  <p className="text-stone-600">No tenés permiso para acceder a esta página.</p>
  <Link className="btn mt-2" to="/">Volver al inicio</Link>
</Card>;
