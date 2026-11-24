import type { Rol } from '../../features/usuarios/types';

export const dinero = (valor: number): string =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(valor);

export const fecha = (iso: string): string => new Date(iso).toLocaleString('es-AR');

/** El rol se guarda como "user" / "admin" (lo pide la consigna); en pantalla se muestra en castellano. */
export const etiquetaRol = (rol: Rol): string => (rol === 'admin' ? 'Administrador' : 'Cliente');

const PARTICULAS = new Set(['de', 'del', 'la', 'las', 'los', 'y', 'e', 'da', 'di', 'do', 'van', 'von']);

const capitalizar = (parte: string): string => {
  // Solo se corrigen palabras escritas todo en minúscula o todo en mayúscula;
  // "McDonald" o "DiMaría" se respetan tal como las escribió el usuario.
  const esUniforme = parte === parte.toLowerCase() || parte === parte.toUpperCase();
  if (!esUniforme) return parte;
  return parte.charAt(0).toLocaleUpperCase('es') + parte.slice(1).toLocaleLowerCase('es');
};

/** "marina giselle cordero" -> "Marina Giselle Cordero"; "juan de la fuente" -> "Juan de la Fuente".
 * Solo cambia cómo se muestra: lo guardado no se modifica. */
export const nombrePropio = (nombre: string): string =>
  nombre.trim().split(/\s+/).map((palabra, i) => {
    if (i > 0 && PARTICULAS.has(palabra.toLowerCase())) return palabra.toLowerCase();
    return palabra.split('-').map(capitalizar).join('-');
  }).join(' ');
