import { flexRender, type Table } from '@tanstack/react-table';
import { Paginacion } from './Paginacion';

/** Tabla genérica de TanStack Table con paginación del lado del cliente. */
export const TablaDatos = <T,>({ tabla, paginar = true }: { tabla: Table<T>; paginar?: boolean }) =>
  <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-stone-100 text-xs tracking-wide text-stone-600 uppercase">{tabla.getHeaderGroups().map((grupo) => <tr key={grupo.id}>
          {grupo.headers.map((h) => <th className="px-4 py-3 font-semibold" key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</th>)}
        </tr>)}</thead>
        <tbody className="divide-y divide-stone-100">{tabla.getRowModel().rows.map((fila) => <tr className="transition even:bg-stone-50/60 hover:bg-orange-50/60" key={fila.id}>
          {fila.getVisibleCells().map((celda) => <td className="px-4 py-3 align-middle" key={celda.id}>{flexRender(celda.column.columnDef.cell, celda.getContext())}</td>)}
        </tr>)}</tbody>
      </table>
    </div>
    {paginar && tabla.getPageCount() > 1 && <div className="border-t border-stone-100">
      <Paginacion pagina={tabla.getState().pagination.pageIndex} totalPaginas={tabla.getPageCount()} onCambiar={(p) => tabla.setPageIndex(p)} />
    </div>}
  </div>;
