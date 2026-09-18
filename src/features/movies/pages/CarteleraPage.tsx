import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import { CarteleraHeroCarousel } from "../components/CarteleraHeroCarousel";
import type { Movie } from "../data/movieData";
import { MovieCard } from "../components/MovieCard";
import { MOVIES } from "../data/movieData";

// Lista curada y completa de géneros cinematográficos
const GENRES = [
  "Todos",
  "Acción",
  "Animación",
  "Comedia",
  "Documental",
  "Drama",
  "Sci-Fi",
  "Terror",
  "Thriller",
] as const;

// CarteleraPage: Vista cinematográfica completa de Películas en Cartelera (/movies)
export const CarteleraPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const theaterFilter = searchParams.get("theater");

  // Estados de filtrado e interacción
  const [selectedGenre, setSelectedGenre] = useState<string>("Todos");
  const [activePreviewMovieId, setActivePreviewMovieId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; subMessage?: string } | null>(null);

  // Películas exclusivamente en cartelera (now-playing)
  const nowPlayingMovies = useMemo(() => {
    return MOVIES.filter((movie) => movie.status === "now-playing");
  }, []);

  // Filtrado por género seleccionado
  const filteredMovies = useMemo(() => {
    return nowPlayingMovies.filter((movie) => {
      const matchesGenre = selectedGenre === "Todos" || movie.genre === selectedGenre;
      return matchesGenre;
    });
  }, [nowPlayingMovies, selectedGenre]);

  // Conteo de películas por género
  const genreCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Todos: nowPlayingMovies.length,
    };
    nowPlayingMovies.forEach((m) => {
      counts[m.genre] = (counts[m.genre] || 0) + 1;
    });
    return counts;
  }, [nowPlayingMovies]);

  // Confirmación simulada de compra
  const handleBuyConfirm = (movie: Movie, time: string) => {
    setToast({
      message: "¡Boleto Adquirido!",
      subMessage: `${movie.title} • Función de hoy a las ${time} • ¡Disfruta la función!`,
    });
  };

  // Cierre automático de Toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="w-full flex flex-col min-h-screen bg-transparent text-cinema-text">
      {/* 1. Carrusel Hero Panorámico de Ancho Completo (Consistencia visual con Inicio) */}
      <CarteleraHeroCarousel movies={nowPlayingMovies} />

      {/* 2. Línea divisoria cinematográfica idéntica al diseño Dexus Midnight */}
      <div className="w-full border-b border-cinema-border relative">
        <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-cinema-muted to-transparent" />
      </div>

      {/* 3. Contenedor centralizado para el catálogo y filtros */}
      <div className="mx-auto max-w-450 w-[90%] px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-8">
        {/* Banner de filtro por complejo si viene por URL */}
        {theaterFilter && (
          <div className="flex items-center justify-between bg-cinema-surface/70 border border-cinema-border px-5 py-3 rounded-2xl backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="text-xl">📍</span>
              <div>
                <p className="text-xs text-cinema-muted font-semibold uppercase tracking-wider">
                  Filtrando por complejo:
                </p>
                <h4 className="text-sm font-bold text-cinema-electric">{theaterFilter}</h4>
              </div>
            </div>
            <button
              onClick={() => setSearchParams({})}
              className="text-xs text-cinema-muted hover:text-cinema-text underline cursor-pointer"
            >
              Quitar filtro
            </button>
          </div>
        )}

        {/* Encabezado de Sección y Filtros de Género */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-cinema-turquoise animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-cinema-turquoise font-mono">
                  Dexus Cinema · Cartelera Oficial
                </span>
              </div>
              <h2 className="text-2xl sm:text-3.5xl font-normal text-cinema-text tracking-wider uppercase font-monument">
                Películas en Cartelera
              </h2>
              <p className="mt-1 text-xs text-cinema-muted max-w-2xl">
                Selecciona tu película favorita, consulta los formatos de sala disponibles (IMAX, 4DX, 2D) y reserva tus asientos para hoy.
              </p>
            </div>

            <span className="text-xs font-semibold text-cinema-muted uppercase tracking-wider font-mono shrink-0">
              {filteredMovies.length} {filteredMovies.length === 1 ? "título disponible" : "títulos disponibles"}
            </span>
          </div>

          {/* Filtro de Géneros en Pills Modernos con contador */}
          <div className="flex gap-2 flex-wrap items-center">
            {GENRES.map((genre) => {
              const isActive = selectedGenre === genre;
              const count = genreCounts[genre] || 0;

              return (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 border cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "border-cinema-turquoise bg-cinema-turquoise/15 text-cinema-turquoise shadow-sm shadow-cinema-turquoise/20 font-semibold"
                      : "border-white/10 bg-cinema-surface/40 text-cinema-muted hover:border-white/25 hover:text-cinema-text"
                  }`}
                >
                  <span>{genre}</span>
                  {count > 0 && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? "bg-cinema-turquoise/25 text-white"
                          : "bg-white/10 text-cinema-muted"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Grid de Películas */}
        <section className="w-full">
          {filteredMovies.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3.5 sm:gap-4 md:gap-5">
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
            <div className="flex flex-col items-center justify-center border border-dashed border-white/15 rounded-3xl py-16 px-4 text-center bg-cinema-surface/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10 text-cinema-muted mb-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
              </svg>
              <h4 className="text-base font-bold text-cinema-text font-monument uppercase">
                No hay películas en este género
              </h4>
              <p className="text-xs text-cinema-muted mt-1.5 max-w-sm">
                No encontramos títulos en cartelera para "{selectedGenre}". Puedes explorar otros géneros o ver todas las opciones disponibles.
              </p>
              <button
                onClick={() => setSelectedGenre("Todos")}
                className="mt-4 rounded-xl bg-cinema-surface hover:bg-cinema-surface-card border border-white/20 px-5 py-2.5 text-xs font-semibold text-cinema-text transition-all cursor-pointer shadow-lg active:scale-95"
              >
                Ver todos los géneros
              </button>
            </div>
          )}
        </section>
      </div>

      {/* 5. Notificación Toast de Compra */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex max-w-sm animate-slide-in rounded-xl border border-cinema-electric/30 bg-cinema-surface/95 p-4 shadow-2xl shadow-cinema-primary/20 backdrop-blur-xl">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cinema-electric/15 text-cinema-electric">
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
              <h5 className="text-xs font-bold text-cinema-text">{toast.message}</h5>
              {toast.subMessage && (
                <p className="text-[11px] leading-relaxed text-cinema-muted">
                  {toast.subMessage}
                </p>
              )}
            </div>
            <button
              onClick={() => setToast(null)}
              className="ml-auto text-cinema-muted hover:text-cinema-text text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
