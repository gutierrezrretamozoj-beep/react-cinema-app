import { useRef } from "react";
import { Link } from "react-router";
import type { Movie } from "@/features/movies/data/movieData";
import { MovieRowCard } from "./MovieRowCard";
import { SeeMoreCard } from "./SeeMoreCard";

interface MovieScrollRowProps {
  title: string;
  subtitle?: string;
  movies: Movie[];
  seeMoreUrl: string;
  seeMoreLabel?: string;
  maxMovies?: number; // Máximo 4 películas + 1 Ver más = 5 tarjetas
}

// MovieScrollRow: Contenedor de fila horizontal con deslizamiento suave y flechas
export const MovieScrollRow = ({
  title,
  subtitle,
  movies,
  seeMoreUrl,
  seeMoreLabel = "Ver más",
  maxMovies = 4,
}: MovieScrollRowProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const displayedMovies = movies.slice(0, maxMovies);
  const remainingCount = Math.max(0, movies.length - maxMovies);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full flex flex-col gap-4">
      {/* Encabezado de la Fila */}
      <div className="flex items-end justify-between px-1">
        <div className="flex flex-col gap-1 text-left">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-yellow-500" />
            <h2 className="text-xl sm:text-2xl font-black text-neutral-100 tracking-tight font-serif">
              {title}
            </h2>
          </div>
          {subtitle && (
            <p className="text-xs text-neutral-400 pl-4">{subtitle}</p>
          )}
        </div>

        {/* Controles de navegación y enlace directo */}
        <div className="flex items-center gap-2">
          <Link
            to={seeMoreUrl}
            className="text-xs font-bold text-yellow-500 hover:text-yellow-400 mr-2 transition-colors hidden sm:inline-block"
          >
            Ver catálogo completo →
          </Link>

          <button
            onClick={() => handleScroll("left")}
            aria-label="Desplazar a la izquierda"
            className="h-8 w-8 rounded-full border border-neutral-800 bg-neutral-900/80 flex items-center justify-center text-neutral-400 hover:text-yellow-400 hover:border-neutral-700 transition cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={() => handleScroll("right")}
            aria-label="Desplazar a la derecha"
            className="h-8 w-8 rounded-full border border-neutral-800 bg-neutral-900/80 flex items-center justify-center text-neutral-400 hover:text-yellow-400 hover:border-neutral-700 transition cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Contenedor con scroll horizontal de máximo 5 tarjetas */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 px-1 scrollbar-thin scrollbar-track-neutral-950 scrollbar-thumb-neutral-800 scroll-smooth"
      >
        {displayedMovies.map((movie) => (
          <MovieRowCard key={movie.id} movie={movie} />
        ))}

        {/* Tarjeta de cierre "Ver más" */}
        <SeeMoreCard
          to={seeMoreUrl}
          label={seeMoreLabel}
          count={remainingCount > 0 ? remainingCount : undefined}
          subtitle={`Explora más películas en ${title.toLowerCase()}`}
        />
      </div>
    </section>
  );
};
