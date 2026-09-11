// MovieCardSkeleton: CSS skeleton loader para el estado de carga inicial
// Se muestra mientras se obtienen datos del servidor, evitando layout shifts.
export const MovieCardSkeleton = () => (
  <div className="mx-auto flex h-full w-full max-w-[17rem] flex-col animate-pulse">
    <div className="flex h-full flex-col overflow-hidden rounded-[1.3rem] border border-neutral-800 bg-neutral-900">
      {/* Poster placeholder */}
      <div className="h-56 w-full bg-neutral-800" />

      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Title */}
        <div className="space-y-1.5">
          <div className="h-4 w-4/5 rounded-md bg-neutral-800" />
          <div className="h-3 w-2/5 rounded-md bg-neutral-800/70" />
        </div>

        {/* Synopsis lines */}
        <div className="space-y-1.5">
          <div className="h-3 w-full rounded-md bg-neutral-800/60" />
          <div className="h-3 w-full rounded-md bg-neutral-800/60" />
          <div className="h-3 w-3/5 rounded-md bg-neutral-800/60" />
        </div>

        {/* Metadata row */}
        <div className="flex gap-2 pt-1">
          <div className="h-3 w-16 rounded-md bg-neutral-800/50" />
          <div className="h-3 w-12 rounded-md bg-neutral-800/50" />
        </div>

        <div className="mt-auto space-y-2">
          {/* Showtimes */}
          <div className="flex gap-1.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-7 w-14 rounded-lg bg-neutral-800" />
            ))}
          </div>
          {/* Button */}
          <div className="h-9 w-full rounded-xl bg-neutral-800" />
        </div>
      </div>
    </div>
  </div>
);

// MovieGridSkeleton: Grid completo de skeletons para el estado de carga inicial
export const MovieGridSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
    {Array.from({ length: count }).map((_, i) => (
      <MovieCardSkeleton key={i} />
    ))}
  </div>
);
