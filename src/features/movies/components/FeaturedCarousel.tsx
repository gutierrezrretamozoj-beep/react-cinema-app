import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Movie } from '../interfaces';
import { Badge } from './Badge';

interface FeaturedCarouselProps {
  movies: Movie[];
  onSelectMovie?: (movie: Movie) => void;
}

// FeaturedCarousel: Carrusel de películas destacadas con autoplay y controles manuales
export const FeaturedCarousel = ({ movies, onSelectMovie }: FeaturedCarouselProps) => {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const featured = movies.filter((m) => m.featured);

  const stopTimer = () => { if (timerRef.current) clearInterval(timerRef.current); };
  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => setIndex((i) => (i + 1) % featured.length), 5000);
  };

  useEffect(() => {
    if (featured.length > 0) startTimer();
    return stopTimer;
  }, [index, featured.length]);

  if (featured.length === 0) return null;
  const current = featured[index];

  return (
    <div
      className="relative w-full h-72 sm:h-80 md:h-96 overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-950 shadow-2xl"
      onMouseEnter={stopTimer}
      onMouseLeave={startTimer}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.85, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={current.backdropUrl || current.posterUrl}
            alt={current.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-transparent" />

          <div className="absolute inset-y-0 left-0 p-6 sm:p-10 md:p-14 flex flex-col justify-center max-w-lg z-10 gap-3 text-left">
            <div className="flex gap-2 items-center flex-wrap">
              <Badge variant="featured" text="Destacada" />
              <Badge variant="genre" text={current.genre} />
              {current.status === 'coming-soon' && <Badge variant="pre-purchase" text="Precompra" />}
              <Badge variant="rating" text={current.rating} ratingType={current.rating} />
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-neutral-100 leading-tight">
              {current.title}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed line-clamp-2 max-w-md">
              {current.synopsis}
            </p>
            {current.director && (
              <p className="text-[11px] text-neutral-500">Dir. {current.director}</p>
            )}

            <button
              onClick={() => onSelectMovie?.(current)}
              className="self-start flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-neutral-950 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:shadow-lg hover:shadow-yellow-500/20 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                <path d="M4.5 3.75a.75.75 0 0 0-1.125.65v15.2a.75.75 0 0 0 1.125.65l13.5-7.6a.75.75 0 0 0 0-1.3l-13.5-7.6Z" />
              </svg>
              {current.status === 'coming-soon' ? 'Precomprar Boleto' : 'Ver detalles'}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Prev / Next */}
      {featured.length > 1 && (
        <>
          <button
            onClick={() => setIndex((i) => (i - 1 + featured.length) % featured.length)}
            aria-label="Película anterior"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900/60 backdrop-blur border border-neutral-800 text-neutral-300 hover:text-yellow-400 hover:border-yellow-500/30 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={() => setIndex((i) => (i + 1) % featured.length)}
            aria-label="Siguiente película"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900/60 backdrop-blur border border-neutral-800 text-neutral-300 hover:text-yellow-400 hover:border-yellow-500/30 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {featured.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Ir al slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-5 bg-yellow-500' : 'w-1.5 bg-neutral-700 hover:bg-neutral-500'}`}
          />
        ))}
      </div>
    </div>
  );
};
