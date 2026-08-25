import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useMovieListings } from '../hooks/useMovieListings';
import type { Movie } from '../interfaces';
import { FeaturedCarousel } from './FeaturedCarousel';
import { FilterSidebar } from './FilterSidebar';
import { DateSelector } from './DateSelector';
import { MovieCard } from './MovieCard';
import { MovieCardSkeleton } from './MovieCardSkeleton';
import { EmptyState } from './EmptyState';

interface Toast { message: string; subMessage?: string }

// MovieListingsPage: Página principal del dashboard de películas
// Orquesta todos los componentes UI y consume useMovieListings para datos reales.
// Layout: sidebar izquierdo (desktop) / topbar colapsable (mobile-tablet)
export const MovieListingsPage = () => {
  const navigate = useNavigate();
  const {
    movies,
    allMovies,
    loading,
    status,
    genre,
    timeSlot,
    hasActiveFilters,
    setStatus,
    setGenre,
    setTimeSlot,
    clearAllFilters,
  } = useMovieListings();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const handleBuy = (_movie: Movie, time: string) => {
    setToast({ message: '¡Ticket reservado!', subMessage: `Función a las ${time}. Revisa tu correo.` });
    setTimeout(() => setToast(null), 4000);
  };

  const handleCarouselSelect = (movie: Movie) => {
    navigate(`/movies/${movie.id}`);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">

        {/* ── Carrusel destacado ── */}
        {!loading && allMovies.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <FeaturedCarousel movies={allMovies} onSelectMovie={handleCarouselSelect} />
          </div>
        )}

        <div className="flex gap-6 lg:gap-8">

          {/* ── Sidebar desktop (lg+) ── */}
          <aside className="hidden lg:block w-52 shrink-0">
            <div className="sticky top-6 bg-neutral-900/50 border border-neutral-800 rounded-2xl p-5">
              <FilterSidebar
                status={status}
                genre={genre}
                timeSlot={timeSlot}
                hasActiveFilters={hasActiveFilters}
                setStatus={setStatus}
                setGenre={setGenre}
                setTimeSlot={setTimeSlot}
                clearAllFilters={clearAllFilters}
              />
            </div>
          </aside>

          {/* ── Contenido principal ── */}
          <main className="flex-1 min-w-0 flex flex-col gap-5">

            {/* Selector de fecha */}
            <section aria-label="Selector de fecha">
              <DateSelector selectedDate={selectedDate} onSelectDate={setSelectedDate} />
            </section>

            {/* Filtros mobile (topbar colapsable) */}
            <div className="lg:hidden">
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-800 bg-neutral-900/60 text-xs font-semibold text-neutral-300 hover:border-neutral-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                </svg>
                Filtros
                {hasActiveFilters && (
                  <span className="ml-1 bg-yellow-500 text-neutral-950 text-[9px] font-bold px-1.5 py-0.5 rounded-full">!</span>
                )}
              </button>

              {filtersOpen && (
                <div className="mt-3 bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4">
                  <FilterSidebar
                    status={status}
                    genre={genre}
                    timeSlot={timeSlot}
                    hasActiveFilters={hasActiveFilters}
                    setStatus={setStatus}
                    setGenre={setGenre}
                    setTimeSlot={setTimeSlot}
                    clearAllFilters={() => { clearAllFilters(); setFiltersOpen(false); }}
                  />
                </div>
              )}
            </div>

            {/* Conteo de resultados */}
            {!loading && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  {movies.length} {movies.length === 1 ? 'película' : 'películas'}
                  {hasActiveFilters && ' encontradas'}
                </span>
              </div>
            )}

            {/* Grid principal */}
            <section aria-label="Listado de películas">
              {loading ? (
                // ── Loading Skeleton ──
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <MovieCardSkeleton key={i} />
                  ))}
                </div>
              ) : movies.length === 0 ? (
                // ── Empty State ──
                <EmptyState onClearFilters={clearAllFilters} />
              ) : (
                // ── Movie Grid ──
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
                  {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} onBuy={handleBuy} />
                  ))}
                </div>
              )}
            </section>
          </main>
        </div>
      </div>

      {/* ── Toast de confirmación ── */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex max-w-sm animate-[slide-in_0.3s_ease] rounded-xl border border-yellow-500/20 bg-neutral-900 p-4 shadow-2xl shadow-yellow-500/5 backdrop-blur-md">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex flex-col gap-0.5">
              <h5 className="text-xs font-bold text-neutral-100">{toast.message}</h5>
              {toast.subMessage && <p className="text-[11px] leading-relaxed text-neutral-400">{toast.subMessage}</p>}
            </div>
            <button onClick={() => setToast(null)} className="text-neutral-500 hover:text-neutral-300 shrink-0 ml-auto focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
