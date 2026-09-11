import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { FeaturedCarousel } from "../components/FeaturedCarousel";
import type { Movie } from "../data/movieData";
import { MovieCard } from "../components/MovieCard";
import { MOVIES } from "../data/movieData";

// CarteleraPage: Vista completa de la Cartelera de Películas (ruta /movies)
// Permite filtrar por películas en cartelera / próximos estrenos, género, horario rápido y complejo de cine.
export const CarteleraPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") === "coming-soon" ? "coming-soon" : "now-playing";
  const theaterFilter = searchParams.get("theater");

  const [activeTab, setActiveTab] = useState<"now-playing" | "coming-soon">(initialTab);
  const [selectedGenre, setSelectedGenre] = useState<string>("Todos");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [activePreviewMovieId, setActivePreviewMovieId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; subMessage?: string } | null>(null);

  // Sincronizar parámetro URL si cambia
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "coming-soon" || tabParam === "now-playing") {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleBuyConfirm = (movie: Movie, time: string) => {
    setToast({
      message: movie.status === 'coming-soon' ? `¡Preventa Confirmada!` : `¡Boleto Adquirido!`,
      subMessage: movie.status === 'coming-soon'
        ? `Precompra de ${movie.title} realizada para la función de las ${time}. ¡Te avisaremos el día del estreno!`
        : `${movie.title} • Función de hoy a las ${time} • ¡Disfruta la función!`
    });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleCarouselBuyClick = (movie: Movie) => {
    setToast({
      message: movie.status === 'coming-soon' ? `Precomprar boletos para: ${movie.title}` : `Comprar boletos para: ${movie.title}`,
      subMessage: "Selecciona un horario disponible en el boleto de abajo para confirmar tu compra."
    });

    if (movie.status !== activeTab) {
      setActiveTab(movie.status);
      setSearchParams({ tab: movie.status });
    }

    if (selectedGenre !== "Todos" && movie.genre !== selectedGenre) {
      setSelectedGenre("Todos");
    }

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

  const filteredMovies = MOVIES.filter((movie) => {
    const matchesTab = movie.status === activeTab;
    const matchesGenre = selectedGenre === "Todos" || movie.genre === selectedGenre;
    const matchesTimeSlot = !selectedTimeSlot || movie.showtimes.includes(selectedTimeSlot);

    return matchesTab && matchesGenre && matchesTimeSlot;
  });

  const genres = ["Todos", "Acción", "Drama", "Sci-Fi", "Thriller", "Terror"];
  const quickTimeSlots = ["14:30", "17:45", "21:00"];

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 sm:pt-8 pb-16 flex flex-col gap-6 md:gap-8">
      {/* Banner de filtro por cine activo si viene por URL */}
      {theaterFilter && (
        <div className="flex items-center justify-between bg-yellow-500/10 border border-yellow-500/30 px-5 py-3 rounded-2xl">
          <div className="flex items-center gap-3">
            <span className="text-xl">📍</span>
            <div>
              <p className="text-xs text-yellow-500/80 font-semibold uppercase tracking-wider">Filtrando por complejo:</p>
              <h4 className="text-sm font-bold text-yellow-400">{theaterFilter}</h4>
            </div>
          </div>
          <button
            onClick={() => setSearchParams({})}
            className="text-xs text-neutral-400 hover:text-neutral-200 underline cursor-pointer"
          >
            Quitar filtro
          </button>
        </div>
      )}

      {/* Carrusel destacado exclusivo de Cartelera */}
      <FeaturedCarousel movies={MOVIES} onSelectMovie={handleCarouselBuyClick} />

      {/* Sección 1: Filtros de Horarios Rápidos de Hoy */}
      <section className="rounded-2xl border border-neutral-900 bg-neutral-900/60 p-6 shadow-sm backdrop-blur-sm">
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-3.5">
          Horarios de hoy (Filtro rápido)
        </h3>
        <div className="flex gap-3 flex-wrap">
          {quickTimeSlots.map((time) => {
            const isActive = selectedTimeSlot === time;
            return (
              <button
                key={time}
                onClick={() => setSelectedTimeSlot(isActive ? null : time)}
                className={`rounded-lg px-5 py-2.5 font-mono text-sm font-semibold transition-all duration-200 border cursor-pointer ${
                  isActive
                    ? "border-yellow-500 bg-yellow-500/10 text-yellow-400 shadow-md shadow-yellow-500/5"
                    : "border-neutral-800 bg-neutral-900/40 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200"
                }`}
              >
                {time}
              </button>
            );
          })}
        </div>
      </section>

      {/* Sección 2: Tabuladores de Cartelera y Botones de Género */}
      <section className="flex flex-col gap-4">
        <div className="flex border-b border-neutral-900">
          <button
            onClick={() => {
              setActiveTab("now-playing");
              setSelectedTimeSlot(null);
              setSearchParams({ tab: "now-playing" });
            }}
            className={`pb-3 text-sm font-semibold uppercase tracking-wider transition-all border-b-2 px-4 cursor-pointer ${
              activeTab === "now-playing"
                ? "border-yellow-500 text-yellow-400"
                : "border-transparent text-neutral-500 hover:text-neutral-300"
            }`}
          >
            En Cartelera
          </button>
          <button
            onClick={() => {
              setActiveTab("coming-soon");
              setSelectedTimeSlot(null);
              setSearchParams({ tab: "coming-soon" });
            }}
            className={`pb-3 text-sm font-semibold uppercase tracking-wider transition-all border-b-2 px-4 cursor-pointer ${
              activeTab === "coming-soon"
                ? "border-yellow-500 text-yellow-400"
                : "border-transparent text-neutral-500 hover:text-neutral-300"
            }`}
          >
            Próximamente
          </button>
        </div>

        <div className="flex gap-2 flex-wrap pb-2">
          {genres.map((genre) => {
            const isActive = selectedGenre === genre;
            return (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 border cursor-pointer ${
                  isActive
                    ? "border-yellow-500/80 bg-yellow-500/10 text-yellow-400"
                    : "border-neutral-800 bg-transparent text-neutral-400 hover:border-neutral-700 hover:text-neutral-200"
                }`}
              >
                {genre}
              </button>
            );
          })}
        </div>
      </section>

      {/* Sección 3: Conteo y Lista del Grid de Películas */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            {filteredMovies.length} {filteredMovies.length === 1 ? "película" : "películas"} encontradas
          </span>
        </div>

        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
            {filteredMovies.map((movie) => (
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
            <h4 className="text-sm font-bold text-neutral-300">
              No hay resultados para esta búsqueda
            </h4>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm">
              Prueba cambiando la pestaña de estreno, quitando el filtro de horario rápido o seleccionando otro género.
            </p>
            <button
              onClick={() => {
                setSelectedGenre("Todos");
                setSelectedTimeSlot(null);
                setActiveTab("now-playing");
                setSearchParams({});
              }}
              className="mt-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 px-4 py-2 text-xs font-semibold text-neutral-200 transition cursor-pointer"
            >
              Restablecer filtros
            </button>
          </div>
        )}
      </section>

      {/* Notificación Toast */}
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
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.89-.777-2.384-.179-2.384 1.009v1.231H10a.75.75 0 1 0 0 1.5h1.25V15a.75.75 0 1 0 1.5 0v-3.178c0-.687.525-1.25 1.182-1.25a.75.75 0 1 0 0-1.5c-.22 0-.424.08-.58.211Z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex flex-col gap-0.5">
              <h5 className="text-xs font-bold text-neutral-100">{toast.message}</h5>
              {toast.subMessage && (
                <p className="text-[11px] leading-relaxed text-neutral-400">{toast.subMessage}</p>
              )}
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-neutral-500 hover:text-neutral-350 shrink-0 ml-auto cursor-pointer"
            >
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
