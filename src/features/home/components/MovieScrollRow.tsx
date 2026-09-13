import { useRef, useState, useEffect } from "react";
import type { Movie } from "@/features/movies/data/movieData";
import { MovieRowCard } from "./MovieRowCard";
import { SeeMoreCard } from "./SeeMoreCard";

interface MovieScrollRowProps {
  title: string;
  subtitle?: string;
  movies: Movie[];
  seeMoreUrl: string;
  seeMoreLabel?: string;
  maxMovies?: number; // Máximo de películas + 1 Ver más
}

// MovieScrollRow: Contenedor de fila horizontal con flechas laterales estilo carrusel principal
export const MovieScrollRow = ({
  title,
  subtitle,
  movies,
  seeMoreUrl,
  seeMoreLabel = "Ver más",
  maxMovies = 5,
}: MovieScrollRowProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const displayedMovies = movies.slice(0, maxMovies);
  const remainingCount = Math.max(0, movies.length - maxMovies);

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [movies]);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = Math.max(320, scrollContainerRef.current.clientWidth * 0.75);
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full gap-4 flex flex-col">
      {/* Encabezado de la Fila (Limpio y minimalista) */}
      <div className="flex items-end justify-between px-1">
        <div className="flex flex-col gap-1 text-left">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cinema-turquoise animate-pulse" />
            <h2 className="text-lg sm:text-xl text-cinema-text tracking-wider uppercase font-monument">
              {title}
            </h2>
          </div>
          {subtitle && (
            <p className="text-xs text-cinema-muted pl-4">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Contenedor relativo para el carrusel y las flechas de navegación estilo carrusel principal */}
      <div className="relative">
        {/* FLECHA IZQUIERDA: Mismo estilo que carrusel principal */}
        <button
          onClick={() => handleScroll("left")}
          aria-label="Desplazar a la izquierda"
          disabled={!canScrollLeft}
          className={`hidden md:flex absolute left-0 top-0 bottom-4 z-20 w-16 h-full items-center justify-center bg-transparent text-cinema-text hover:text-cinema-electric/80 hover:bg-linear-to-l from-transparent to-black/60 transition-all hover:scale-110 active:scale-95 cursor-pointer rounded-l-lg ${
            canScrollLeft
              ? "opacity-80 hover:opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* Contenedor con scroll horizontal de tarjetas */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-2 px-1 scrollbar-none [-ms-overflow-style:none] flex:hidden scroll-smooth"
        >
          {displayedMovies.map((movie) => (
            <MovieRowCard key={movie.id} movie={movie} />
          ))}

          {/* Tarjeta de cierre "Ver más" que conduce al catálogo completo */}
          <SeeMoreCard
            to={seeMoreUrl}
            label={seeMoreLabel}
            count={remainingCount > 0 ? remainingCount : undefined}
            subtitle={`Explora más películas en ${title.toLowerCase()}`}
          />
        </div>

        {/* FLECHA DERECHA: Mismo estilo que carrusel principal */}
        <button
          onClick={() => handleScroll("right")}
          aria-label="Desplazar a la derecha"
          disabled={!canScrollRight}
          className={`hidden md:flex absolute right-0 top-0 bottom-4 z-20 w-16 items-center justify-center bg-transparent text-cinema-text  hover:text-cinema-electric/80 hover:bg-linear-to-r from-transparent to-black/60 transition-all hover:scale-110 active:scale-95 cursor-pointer rounded-r-lg ${
            canScrollRight
              ? "opacity-80 hover:opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </section>
  );
};
