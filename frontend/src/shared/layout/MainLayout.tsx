import { ChefHat } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '../ui/Toaster';
import { Navbar } from './Navbar';

export const MainLayout = () => <div className="flex min-h-screen flex-col">
  <Navbar />
  <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8"><Outlet /></main>
  <footer className="border-t border-stone-200 bg-white">
    <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-5 text-sm text-stone-500">
      <span className="inline-flex items-center gap-2"><ChefHat className="size-4 text-orange-600" aria-hidden />Food Store · Trabajo Práctico Integrador</span>
      <span>Marina Giselle Cordero · Programación 4</span>
    </div>
  </footer>
  <Toaster />
</div>;
