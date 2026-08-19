import { useState, useEffect } from "react";
import { FeaturedCarousel } from "./components/FeaturedCarousel";
import type { Movie, MovieGenre } from "@/features/movies";
import { MovieCard } from "./components/MovieCard";
import { LocationSelector } from "@/features/movies/components/LocationSelector";
import { getEffectiveCity, useMovieListings } from "@/features/movies";

const QUICK_TIME_SLOTS = ["14:30", "17:45", "21:00"];

const GENRES: Array<"Todos" | MovieGenre> = ["Todos", "Acción", "Drama", "Sci-Fi", "Thriller", "Terror"];

/**
 * Home page: the main cinema listings view.
 *
 * Reads the filters from the URL through `useMovieListings`, updates results in
 * real time without reloading and persists every filter change as a query
 * parameter so the state can be shared or restored.
 */
export const HomePage = () => {
  const {
    loading,
    allMovies,
    movies,
    status,
    genre,
    timeSlot,
    setStatus,
    setGenre,
    setTimeSlot,
    clearAllFilters,
    needsLocationSelection,
    selectCity,
  } = useMovieListings();

  const [activePreviewMovieId, setActivePreviewMovieId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; subMessage?: string } | null>(null);

  const handleBuyConfirm = (movie: Movie, time: string) => {
    setToast({
      message: movie.status === "coming-soon" ? "¡Preventa Confirmada!" : "¡Boleto Adquirido!",
      subMessage:
        movie.status === "coming-soon"
          ? `Precompra de ${movie.title} realizada para la función de las ${time}. ¡Te avisaremos el día del estreno!`
          : `${movie.title} • Función de hoy a las ${time} • ¡Disfruta la función!`,
    });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleCarouselBuyClick = (movie: Movie) => {
    setToast({
      message:
        movie.status === "coming-soon"
          ? `Precomprar boletos para: ${movie.title}`
          : `Comprar boletos para: ${movie.title}`,
      subMessage: "Selecciona un horario disponible en el boleto de abajo para confirmar tu compra.",
    });

    if (movie.status !== status) setStatus(movie.status);

    if (genre !== null && movie.genre !== genre) setGenre(null);

    setTimeout(() => {
      const element = document.getElementById(`movie-card-${movie.id}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });

        element.classList.add("ring-2", "ring-yellow-500", "scale-105");
        setTimeout(() => {
          element.classList.remove("ring-2", "ring-yellow-500", "scale-105");
        }, 2000);
      }
    }, 150);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 flex flex-col gap-6 md:gap-8">
      <FeaturedCarousel movies={allMovies} onSelectMovie={handleCarouselBuyClick} />

      <section className="rounded-xl border border-neutral-900 bg-neutral-950 p-6 shadow-sm">
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-3.5">
          Horarios de hoy (Filtro rápido)
        </h3>
        <div className="flex gap-3 flex-wrap">
          {QUICK_TIME_SLOTS.map((time) => {
            const isActive = timeSlot === time;
            return (
              <button
                key={time}
                onClick={() => setTimeSlot(isActive ? null : time)}
                className={`rounded-lg px-5 py-2.5 font-mono text-sm font-semibold transition-all duration-200 border ${
                  isActive
                    ? "border-yellow-500 bg-yellow-500/10 text-yellow-400 shadow-md shadow-yellow-500/5"
                    : "border-neutral-900 bg-neutral-900/40 text-neutral-400 hover:border-neutral-800 hover:text-neutral-200"
                }`}
              >
                {time}
              </button>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex border-b border-neutral-900">
          <button
            onClick={() => setStatus("now-playing")}
            className={`pb-3 text-sm font-semibold uppercase tracking-wider transition-all border-b-2 px-4 ${
              status === "now-playing"
                ? "border-yellow-500 text-yellow-400"
                : "border-transparent text-neutral-500 hover:text-neutral-300"
            }`}
          >
            En Cartelera
          </button>
          <button
            onClick={() => setStatus("coming-soon")}
            className={`pb-3 text-sm font-semibold uppercase tracking-wider transition-all border-b-2 px-4 ${
              status === "coming-soon"
                ? "border-yellow-500 text-yellow-400"
                : "border-transparent text-neutral-500 hover:text-neutral-300"
            }`}
          >
            Próximamente
          </button>
        </div>

        <div className="flex gap-2 flex-wrap pb-2">
          {GENRES.map((genreOption) => {
            const isActive = genre === genreOption;
            return (
              <button
                key={genreOption}
                onClick={() => setGenre(genreOption === "Todos" ? null : genreOption)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 border ${
                  isActive
                    ? "border-yellow-500/80 bg-yellow-500/5 text-yellow-400"
                    : "border-neutral-800 bg-transparent text-neutral-400 hover:border-neutral-700 hover:text-neutral-200"
                }`}
              >
                {genreOption}
              </button>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            {movies.length} {movies.length === 1 ? "película" : "películas"} encontradas
          </span>

          {(timeSlot || genre !== null || status !== "now-playing") && (
            <button
              onClick={clearAllFilters}
              className="rounded-full border border-yellow-500/30 bg-yellow-500/5 px-3 py-1 text-[11px] font-semibold text-yellow-400 transition hover:bg-yellow-500/10"
            >
              Limpiar todos los filtros
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-sm text-neutral-500">
            Cargando cartelera...
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isDimmed={Boolean(activePreviewMovieId) && activePreviewMovieId !== movie.id}
                onPreviewChange={setActivePreviewMovieId}
                onBuy={handleBuyConfirm}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center border border-dashed border-neutral-850 rounded-2xl py-16 px-4 text-center bg-neutral-900/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10 text-neutral-600 mb-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
              />
            </svg>
            <h4 className="text-sm font-bold text-neutral-300">No hay resultados para esta búsqueda</h4>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm">
              Prueba cambiando la pestaña de estreno, quitando el filtro de horario rápido o seleccionando otro
              género.
            </p>
            <button
              onClick={clearAllFilters}
              className="mt-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 px-4 py-2 text-xs font-semibold text-neutral-200 transition"
            >
              Restablecer filtros
            </button>
          </div>
        )}
      </section>

      {needsLocationSelection && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <LocationSelector onSelect={selectCity} onCancel={() => selectCity(getEffectiveCity())} />
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex max-w-sm animate-slide-in rounded-xl border border-yellow-500/20 bg-neutral-900 p-4 shadow-2xl shadow-yellow-500/5 backdrop-blur-md">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.89-.777-2.384-.179-2.384 1.009v1.231H10a.75.75 0 1 0 0 1.5h1.25V15a.75.75 0 1 0 1.5 0v-3.178c0-.687.525-1.25 1.182-1.25a.75.75 0 1 0 0-1.5c-.22 0-.424.08-.58.211Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex flex-col gap-0.5">
              <h5 className="text-xs font-bold text-neutral-100">{toast.message}</h5>
              {toast.subMessage && (
                <p className="text-[11px] leading-relaxed text-neutral-400">{toast.subMessage}</p>
              )}
            </div>
            <button onClick={() => setToast(null)} className="text-neutral-500 hover:text-neutral-350 shrink-0 ml-auto">
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