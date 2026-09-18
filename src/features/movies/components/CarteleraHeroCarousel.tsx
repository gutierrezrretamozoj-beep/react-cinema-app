import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { getFriendlyRating, type Movie } from "../data/movieData";

interface CarteleraHeroCarouselProps {
  movies: Movie[];
}

// CarteleraHeroCarousel: Carrusel cinemático de ancho completo para la Cartelera
// Mantiene consistencia visual absoluta con el Hero Carousel de Inicio
export const CarteleraHeroCarousel = ({ movies }: CarteleraHeroCarouselProps) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Filtramos las películas que aparecerán en el carrusel principal (las destacadas o disponibles)
  const carouselMovies = movies.length > 0 ? movies : [];

  const handleNext = () => {
    if (carouselMovies.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % carouselMovies.length);
  };

  const handlePrev = () => {
    if (carouselMovies.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + carouselMovies.length) % carouselMovies.length);
  };

  // Soporte de deslizamiento táctil (Swipe)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;

    if (diffX > 45) {
      handleNext();
    } else if (diffX < -45) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  // Autoplay cada 6 segundos con pausa en hover
  useEffect(() => {
    if (isHovered || carouselMovies.length <= 1) return;

    timerRef.current = setInterval(() => {
      handleNext();
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isHovered, carouselMovies.length]);

  if (carouselMovies.length === 0) return null;

  const currentMovie = carouselMovies[currentIndex];

  return (
    <div
      className="relative w-full h-[80dvh] sm:h-[70vh] overflow-hidden bg-neutral-950 select-none group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Fondo panorámico con zoom cinemático */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 w-full h-full cursor-pointer"
          onClick={() => navigate(`/movies/${currentMovie.id}`)}
        >
          <img
            src={currentMovie.backdropUrl || currentMovie.posterUrl}
            alt={currentMovie.title}
            className="w-full h-full object-cover object-center"
          />

          {/* Gradientes cinematográficos para legibilidad y elegancia */}
          <div className="absolute inset-0 bg-linear-to-r from-neutral-950/95 via-neutral-950/30 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Contenido superpuesto alineado con el sistema de grilla */}
      <div className="relative mx-auto max-w-380 h-[65vh] px-4 sm:px-6 lg:px-8 flex items-center z-20 pointer-events-none">
        <div className="w-full max-w-xs md:max-w-md lg:max-w-xl text-left pointer-events-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMovie.id + "-info"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="flex flex-col mt-20 sm:mt-0 gap-4 sm:gap-5 p-4 sm:p-8 bg-transparent"
            >


              {/* Título de la película */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight uppercase leading-[1.05] font-serif drop-shadow-md">
                {currentMovie.title}
              </h1>

              {/* Sinopsis truncada */}
              <p className="text-xs sm:text-sm text-neutral-300/90 line-clamp-3 leading-relaxed max-w-xl font-normal truncate">
                {currentMovie.synopsis}
              </p>

              {/* Botón Ver Detalles */}
              <div className="pt-2 flex items-center gap-4">
                <Link
                  to={`/movies/${currentMovie.id}`}
                  className="inline-flex items-center justify-center rounded-xl border border-white/40 bg-transparent px-4 py-2.5 text-[10px] sm:text-xs lg:px-4 lg:py-3 gap-2 sm:gap-2.5 font-normal uppercase tracking-[0.2em] text-cinema-text transition-all duration-300 hover:border-cinema-electric hover:shadow-lg hover:shadow-cinema-electric/20 active:scale-95 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 text-cinema-electric/80" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.5 3.75a.75.75 0 0 0-1.125.65v15.2a.75.75 0 0 0 1.125.65l13.5-7.6a.75.75 0 0 0 0-1.3l-13.5-7.6Z" />
                  </svg>
                  <span>Ver detalles</span>
                </Link>
              </div>

              {/* Fila de Métricas: Duración, Rating, Clasificación, Género */}
              <div className="pt-4 mt-2 border-t border-white/10 grid grid-cols-4 gap-2 sm:gap-4 text-left max-w-lg">
                <div>
                  <div className="text-xs sm:text-sm font-black text-white font-mono leading-none">
                    {currentMovie.duration}
                  </div>
                  <div className="text-[9px] uppercase tracking-widest text-neutral-400 mt-1">
                    Duración
                  </div>
                </div>

                <div>
                  <div className="text-xs sm:text-sm font-black text-cinema-gold font-mono leading-none">
                    {currentMovie.averageRating || "4.8/5"} ★
                  </div>
                  <div className="text-[9px] uppercase tracking-widest text-neutral-400 mt-1">
                    Rating
                  </div>
                </div>

                <div>
                  <div className="text-xs sm:text-sm font-black text-cinema-turquoise font-mono leading-none">
                    {getFriendlyRating(currentMovie.rating)}
                  </div>
                  <div className="text-[9px] uppercase tracking-widest text-neutral-400 mt-1">
                    Clasificación
                  </div>
                </div>

                <div>
                  <div className="text-xs sm:text-sm font-black text-cinema-text font-mono leading-none">
                    {currentMovie.genre}
                  </div>
                  <div className="text-[9px] uppercase tracking-widest text-neutral-400 mt-1">
                    Género
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Flechas de Navegación laterales (Desktop) */}
      <button
        onClick={handlePrev}
        aria-label="Anterior película"
        className="hidden lg:flex absolute left-4 sm:left-0 top-1/2 -translate-y-1/2 z-30 h-full w-18 items-center justify-center bg-transparent text-white hover:border-yellow-500 hover:text-yellow-400 hover:bg-linear-to-l from-transparent to-black/50 transition-all hover:scale-110 active:scale-95 cursor-pointer"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      <button
        onClick={handleNext}
        aria-label="Siguiente película"
        className="hidden lg:flex absolute right-4 sm:right-0 top-1/2 -translate-y-1/2 z-30 h-full w-18 items-center justify-center bg-transparent text-white hover:border-yellow-500 hover:text-yellow-400 hover:bg-linear-to-r from-transparent to-black/50 transition-all hover:scale-110 active:scale-95 cursor-pointer"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Indicadores inferiores (Dots) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {carouselMovies.map((movie, i) => {
          const isActive = currentIndex === i;
          return (
            <button
              key={movie.id}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Ir a película ${movie.title}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                isActive
                  ? "w-8 h-2 bg-cinema-turquoise shadow-[0_0_10px_rgba(0,255,204,0.6)]"
                  : "w-2 h-2 bg-white/30 hover:bg-white/60"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};
