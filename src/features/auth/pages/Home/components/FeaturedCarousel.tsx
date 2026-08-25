import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Movie } from "../data/movieData";
import { Badge } from "./Badge";

interface FeaturedCarouselProps {
  movies: Movie[];
  onSelectMovie?: (movie: Movie) => void;
}

// FeaturedCarousel: Componente del carrusel para películas destacadas
// Muestra banners panorámicos y textos de películas con autoplay y controles manuales.
export const FeaturedCarousel = ({ movies, onSelectMovie }: FeaturedCarouselProps) => {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Filtrado de destacadas: Extrae solo los elementos con la etiqueta "featured" activa
  const activeMovies = movies.filter(m => m.featured);

  // startTimer: Autoplay del carrusel
  // Inicializa un intervalo de 5 segundos para pasar a la siguiente diapositiva automáticamente.
  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      handleNext();
    }, 5000);
  };

  // stopTimer: Pausado del autoplay
  // Limpia el temporizador para evitar saltos bruscos mientras el usuario interactúa.
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  // useEffect (Timer cycle): Control del ciclo de vida del autoplay
  // Reinicia el timer al cambiar de slide y asegura limpiar el intervalo al desmontar el componente.
  useEffect(() => {
    if (activeMovies.length > 0) {
      startTimer();
    }
    return () => stopTimer();
  }, [index, activeMovies.length]);

  if (activeMovies.length === 0) return null;

  const currentMovie = activeMovies[index];

  // handleNext: Avanza de diapositiva
  // Incrementa el índice circularmente basándose en el total de películas disponibles.
  const handleNext = () => {
    setIndex((prevIndex) => (prevIndex + 1) % activeMovies.length);
  };

  // handlePrev: Retrocede de diapositiva
  // Decrementa el índice de forma circular protegiendo índices negativos.
  const handlePrev = () => {
    setIndex((prevIndex) => (prevIndex - 1 + activeMovies.length) % activeMovies.length);
  };

  // handleDotClick: Salto directo
  // Cambia la vista activa del carrusel al hacer clic en un indicador del panel inferior.
  const handleDotClick = (i: number) => {
    setIndex(i);
  };

  return (
    <div 
      className="relative w-full h-80 sm:h-95 md:h-105 overflow-hidden rounded-3xl border border-neutral-800/80 bg-neutral-950 shadow-2xl"
      onMouseEnter={stopTimer}
      onMouseLeave={startTimer}
    >
      <AnimatePresence mode="wait">
        {/* motion.div (Slide transition): Animación cinemática */}
        {/* Realiza un fundido cruzado (fade) y un zoom inverso (scale) al cambiar de película. */}
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.85, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={currentMovie.backdropUrl || currentMovie.posterUrl}
            alt={currentMovie.title}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-linear-to-r from-neutral-950 via-neutral-950/70 to-transparent" />
          
          <div className="absolute inset-0 bg-linear-to-t from-neutral-950/90 via-transparent to-transparent" />

          <div className="absolute inset-y-0 left-0 p-8 sm:p-12 md:p-16 flex flex-col justify-center max-w-lg z-10 gap-3.5 text-left">
            <div className="flex gap-2 items-center">
              <Badge variant="featured" text="Destacada" />
              <Badge variant="genre" text={currentMovie.genre} />
              {currentMovie.status === 'coming-soon' && (
                <Badge variant="pre-purchase" text="Precompra" />
              )}
              <Badge variant="rating" text={currentMovie.rating} ratingType={currentMovie.rating} />
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3.5xl font-extrabold text-neutral-100 font-serif leading-tight">
              {currentMovie.title}
            </h1>

            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed line-clamp-3 font-normal max-w-md">
              {currentMovie.synopsis}
            </p>

            <div className="mt-2.5">
              <button
                onClick={() => onSelectMovie?.(currentMovie)}
                className="group flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-neutral-950 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:shadow-lg hover:shadow-yellow-500/20 active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-3.5 w-3.5 transition-transform group-hover:scale-110"
                >
                  <path d="M4.5 3.75a.75.75 0 0 0-1.125.65v15.2a.75.75 0 0 0 1.125.65l13.5-7.6a.75.75 0 0 0 0-1.3l-13.5-7.6Z" />
                </svg>
                {currentMovie.status === 'coming-soon' ? 'Precomprar Boleto' : 'Comprar Boleto'}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900/60 backdrop-blur border border-neutral-800/80 text-neutral-300 hover:text-yellow-400 hover:border-yellow-500/30 transition-all active:scale-95"
        aria-label="Anterior película"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900/60 backdrop-blur border border-neutral-800/80 text-neutral-300 hover:text-yellow-400 hover:border-yellow-500/30 transition-all active:scale-95"
        aria-label="Siguiente película"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {activeMovies.map((_, i) => {
          const isActive = index === i;
          return (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                isActive ? "w-6 bg-yellow-500" : "w-2 bg-neutral-700 hover:bg-neutral-500"
              }`}
              aria-label={`Ir al slide ${i + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
};
