// MovieCardSkeleton: Loading skeleton con animación pulse
// Misma estructura que MovieCard pero con bloques grises animados.
export const MovieCardSkeleton = () => (
  <div className="w-full max-w-72 flex flex-col items-center mx-auto animate-pulse">
    {/* Poster skeleton */}
    <div className="w-full bg-neutral-900 border-t border-x border-neutral-800 rounded-t-2xl overflow-hidden">
      <div className="h-56 w-full bg-neutral-800" />

      <div className="p-5 flex flex-col gap-3.5">
        {/* Título */}
        <div>
          <div className="h-4 bg-neutral-800 rounded w-3/4 mb-2" />
          <div className="h-3 bg-neutral-800 rounded w-1/2" />
        </div>

        {/* Sinopsis */}
        <div className="space-y-1.5">
          <div className="h-2.5 bg-neutral-800 rounded w-full" />
          <div className="h-2.5 bg-neutral-800 rounded w-4/5" />
        </div>

        {/* Formatos */}
        <div className="flex gap-1.5">
          <div className="h-4 w-8 bg-neutral-800 rounded" />
          <div className="h-4 w-10 bg-neutral-800 rounded" />
          <div className="h-4 w-8 bg-neutral-800 rounded" />
        </div>

        {/* Horarios */}
        <div>
          <div className="h-2.5 bg-neutral-800 rounded w-1/3 mb-2" />
          <div className="grid grid-cols-3 gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-7 bg-neutral-800 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Divisor */}
    <div className="w-full h-6 bg-neutral-900 border-x border-neutral-800" />

    {/* Talón */}
    <div className="w-full h-20 bg-neutral-900 border-x border-b border-neutral-800 rounded-b-2xl flex items-center px-4">
      <div className="h-9 w-full bg-neutral-800 rounded-xl" />
    </div>
  </div>
);
