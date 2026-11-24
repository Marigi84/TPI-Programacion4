export const Skeleton = ({ cantidad = 3 }: { cantidad?: number }) =>
  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Cargando" aria-busy="true">
    {Array.from({ length: cantidad }, (_, n) => <div key={n} className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
      <div className="h-36 animate-pulse bg-stone-200" />
      <div className="grid gap-2 p-5"><div className="h-5 w-2/3 animate-pulse rounded bg-stone-200" /><div className="h-4 w-1/3 animate-pulse rounded bg-stone-200" /></div>
    </div>)}
  </div>;
