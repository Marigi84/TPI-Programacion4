import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ChefHat, ChevronDown, ClipboardList, LayoutDashboard, LogIn, LogOut, Menu, Package,
  ShoppingCart, Tags, User, UserPlus, Users, UtensilsCrossed, X, type LucideIcon,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { etiquetaRol, nombrePropio } from '../utils/formato';

interface Enlace { to: string; texto: string; Icono: LucideIcon }

const ENLACES_ADMIN: Enlace[] = [
  { to: '/admin/resumen', texto: 'Resumen', Icono: LayoutDashboard },
  { to: '/admin/categorias', texto: 'Categorías', Icono: Tags },
  { to: '/admin/productos', texto: 'Productos', Icono: Package },
  { to: '/admin/pedidos', texto: 'Pedidos', Icono: ClipboardList },
  { to: '/admin/usuarios', texto: 'Usuarios', Icono: Users },
];

const claseEnlace = ({ isActive }: { isActive: boolean }) =>
  `inline-flex items-center gap-2 rounded-lg px-3 py-2 font-medium transition ${isActive ? 'bg-white/10 text-orange-300' : 'text-stone-200 hover:bg-white/5 hover:text-white'}`;

export const Navbar = () => {
  const usuario = useAuthStore((s) => s.usuario);
  const logout = useAuthStore((s) => s.logout);
  const cantidad = useCartStore((s) => s.items.reduce((suma, item) => suma + item.cantidad, 0));
  const navigate = useNavigate();
  const [menuMovil, setMenuMovil] = useState(false);
  const [panelAbierto, setPanelAbierto] = useState(false);
  const cerrarMenus = () => { setMenuMovil(false); setPanelAbierto(false); };
  const cerrarSesion = () => { cerrarMenus(); void logout().then(() => navigate('/login')); };
  const esAdmin = usuario?.role === 'admin';

  const carrito = <NavLink to="/carrito" onClick={cerrarMenus} className={claseEnlace}>
    <span className="relative">
      <ShoppingCart className="size-5" aria-hidden />
      {cantidad > 0 && <span className="absolute -top-2 -right-2.5 grid min-w-5 place-items-center rounded-full bg-orange-500 px-1 text-xs font-bold text-white">{cantidad}</span>}
    </span>
    <span>Carrito</span><span className="sr-only">({cantidad} productos)</span>
  </NavLink>;

  const sesion = usuario
    ? <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-full bg-orange-500/20 text-orange-300"><User className="size-5" aria-hidden /></span>
          <span className="leading-tight">
            <span className="block font-semibold text-white">{nombrePropio(usuario.full_name)}</span>
            <span className="block text-xs text-stone-400">{etiquetaRol(usuario.role)}</span>
          </span>
        </span>
        <button type="button" onClick={cerrarSesion} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-stone-300 transition hover:bg-white/5 hover:text-white">
          <LogOut className="size-4" aria-hidden />Cerrar sesión
        </button>
      </div>
    : <div className="flex items-center gap-2">
        <NavLink to="/login" onClick={cerrarMenus} className={claseEnlace}><LogIn className="size-4" aria-hidden />Ingresar</NavLink>
        <Link to="/register" onClick={cerrarMenus} className="btn"><UserPlus className="size-4" aria-hidden />Crear cuenta</Link>
      </div>;

  return <header className="sticky top-0 z-30 bg-stone-900 shadow-md">
    <nav className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3">
      <Link to="/" onClick={cerrarMenus} className="mr-4 inline-flex items-center gap-2 text-xl font-extrabold text-white">
        <span className="grid size-9 place-items-center rounded-xl bg-orange-600"><ChefHat className="size-5" aria-hidden /></span>
        Food Store
      </Link>

      {/* Escritorio */}
      <div className="hidden flex-1 items-center gap-1 lg:flex">
        <NavLink to="/" end className={claseEnlace}><UtensilsCrossed className="size-4" aria-hidden />Catálogo</NavLink>
        {usuario && <NavLink to="/mis-pedidos" className={claseEnlace}><ClipboardList className="size-4" aria-hidden />Mis pedidos</NavLink>}
        {esAdmin && <div className="relative">
          <button type="button" onClick={() => setPanelAbierto(!panelAbierto)} aria-expanded={panelAbierto}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-stone-200 transition hover:bg-white/5 hover:text-white">
            <LayoutDashboard className="size-4" aria-hidden />Panel admin<ChevronDown className={`size-4 transition ${panelAbierto ? 'rotate-180' : ''}`} aria-hidden />
          </button>
          {panelAbierto && <>
            {/* Capa transparente: un clic afuera cierra el menú. */}
            <div className="fixed inset-0 z-10" onClick={() => setPanelAbierto(false)} />
            <div className="absolute left-0 z-20 mt-2 grid w-56 gap-1 rounded-xl border border-stone-700 bg-stone-800 p-2 shadow-xl">
              {ENLACES_ADMIN.map(({ to, texto, Icono }) => <NavLink key={to} to={to} onClick={cerrarMenus} className={claseEnlace}>
                <Icono className="size-4" aria-hidden />{texto}</NavLink>)}
            </div>
          </>}
        </div>}
        <div className="ml-auto flex items-center gap-3">{carrito}{sesion}</div>
      </div>

      {/* Celular */}
      <div className="ml-auto flex items-center gap-1 lg:hidden">
        {carrito}
        <button type="button" onClick={() => setMenuMovil(!menuMovil)} aria-expanded={menuMovil} className="rounded-lg p-2 text-stone-200 hover:bg-white/5">
          {menuMovil ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
          <span className="sr-only">Menú</span>
        </button>
      </div>
    </nav>
    {menuMovil && <div className="grid gap-1 border-t border-stone-800 px-4 pt-2 pb-4 lg:hidden">
      <NavLink to="/" end onClick={cerrarMenus} className={claseEnlace}><UtensilsCrossed className="size-4" aria-hidden />Catálogo</NavLink>
      {usuario && <NavLink to="/mis-pedidos" onClick={cerrarMenus} className={claseEnlace}><ClipboardList className="size-4" aria-hidden />Mis pedidos</NavLink>}
      {esAdmin && <>
        <p className="mt-2 px-3 text-xs font-semibold tracking-wide text-stone-500 uppercase">Panel admin</p>
        {ENLACES_ADMIN.map(({ to, texto, Icono }) => <NavLink key={to} to={to} onClick={cerrarMenus} className={claseEnlace}>
          <Icono className="size-4" aria-hidden />{texto}</NavLink>)}
      </>}
      <div className="mt-2 border-t border-stone-800 pt-3">{sesion}</div>
    </div>}
  </header>;
};
