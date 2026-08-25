import type { MovieGenre, MovieStatus } from '../interfaces';

interface FilterSidebarProps {
  status: MovieStatus;
  genre: MovieGenre | null;
  timeSlot: string | null;
  hasActiveFilters: boolean;
  setStatus: (s: MovieStatus) => void;
  setGenre: (g: MovieGenre | null) => void;
  setTimeSlot: (t: string | null) => void;
  clearAllFilters: () => void;
}

const GENRES: MovieGenre[] = ['Acción', 'Drama', 'Sci-Fi', 'Thriller', 'Terror'];
const QUICK_TIMES = ['Mañana', 'Tarde', 'Noche'];
const TIME_RANGES: Record<string, string> = {
  Mañana: '< 14:00',
  Tarde: '14:00–18:00',
  Noche: '> 18:00',
};

// FilterSidebar: Panel de filtros conectado al hook useMovieListings
// Controla status (cartelera/próximamente), género y franja horaria.
export const FilterSidebar = ({
  status,
  genre,
  timeSlot,
  hasActiveFilters,
  setStatus,
  setGenre,
  setTimeSlot,
  clearAllFilters,
}: FilterSidebarProps) => {
  return (
    <aside className="flex flex-col gap-6 min-w-[200px]" aria-label="Filtros de películas">
      {/* Status tabs */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-3">
          Cartelera
        </p>
        <div className="flex flex-col gap-1.5">
          {(['now-playing', 'coming-soon'] as MovieStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              aria-pressed={status === s}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all border
                focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500
                ${
                  status === s
                    ? 'bg-yellow-500/10 border-yellow-500/60 text-yellow-400'
                    : 'bg-transparent border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
                }`}
            >
              {s === 'now-playing' ? '🎬 En Cartelera' : '🔜 Próximamente'}
            </button>
          ))}
        </div>
      </div>

      {/* Género */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-3">
          Género
        </p>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => setGenre(null)}
            aria-pressed={genre === null}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all border
              focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500
              ${
                genre === null
                  ? 'bg-yellow-500/10 border-yellow-500/60 text-yellow-400'
                  : 'bg-transparent border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
              }`}
          >
            Todos
          </button>
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setGenre(genre === g ? null : g)}
              aria-pressed={genre === g}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all border
                focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500
                ${
                  genre === g
                    ? 'bg-yellow-500/10 border-yellow-500/60 text-yellow-400'
                    : 'bg-transparent border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
                }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Franja horaria */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-3">
          Horario
        </p>
        <div className="flex flex-col gap-1.5">
          {QUICK_TIMES.map((t) => (
            <button
              key={t}
              onClick={() => setTimeSlot(timeSlot === t ? null : t)}
              aria-pressed={timeSlot === t}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all border
                focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500
                ${
                  timeSlot === t
                    ? 'bg-yellow-500/10 border-yellow-500/60 text-yellow-400'
                    : 'bg-transparent border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
                }`}
            >
              {t}
              <span className="ml-1 text-neutral-600 font-normal">{TIME_RANGES[t]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Limpiar filtros */}
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="w-full mt-auto px-3 py-2 rounded-lg border border-red-500/30 text-red-400 text-xs font-semibold
            hover:bg-red-500/10 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          ✕ Limpiar filtros
        </button>
      )}
    </aside>
  );
};
