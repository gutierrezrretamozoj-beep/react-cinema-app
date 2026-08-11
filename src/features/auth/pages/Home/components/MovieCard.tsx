import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import type { Movie } from "../data/movieData";
import { Badge } from "./Badge";

interface MovieCardProps {
  movie: Movie;
  onBuy?: (movie: Movie, selectedTime: string) => void;
  isDimmed?: boolean;
  onPreviewChange?: (movieId: string | null) => void;
}

export const MovieCard = ({ movie, isDimmed = false, onPreviewChange }: MovieCardProps) => {
  const { id, title, genre, rating, posterUrl, duration, synopsis, showtimes, trailerUrl } = movie;

  const [selectedTime, setSelectedTime] = useState<string | null>(showtimes[0] ?? null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const PREVIEW_DELAY = 1000;

  const clearHoverTimer = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearHoverTimer();
  }, []);

  const handlePreviewStart = () => {
    clearHoverTimer();
    hoverTimerRef.current = window.setTimeout(() => {
      setIsPreviewing(true);
      onPreviewChange?.(movie.id);
    }, PREVIEW_DELAY);
  };

  const handlePreviewEnd = () => {
    clearHoverTimer();
    setIsPreviewing(false);
    onPreviewChange?.(null);
  };

  const isTimeAvailable = (_time: string, index: number) => {
    return !((Number(id) % 2 === 0 && index === 0) || (Number(id) % 3 === 0 && index === 2));
  };

  return (
    <motion.div
      id={`movie-card-${id}`}
      initial={false}
      animate={{
        scale: isPreviewing ? 1.08 : isDimmed ? 0.96 : 1,
        y: isPreviewing ? -18 : isDimmed ? 6 : 0,
        zIndex: isPreviewing ? 40 : isDimmed ? 8 : 10,
        opacity: isPreviewing ? 1 : isDimmed ? 0.62 : 1,
        boxShadow: isPreviewing ? "0 24px 60px -20px rgba(0,0,0,0.85)" : "0 0 0 rgba(0,0,0,0)",
        filter: isPreviewing ? "none" : isDimmed ? "saturate(0.7) blur(0.25px)" : "none",
      }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={handlePreviewStart}
      onMouseLeave={handlePreviewEnd}
      onFocus={handlePreviewStart}
      onBlur={handlePreviewEnd}
      tabIndex={0}
      className="mx-auto flex h-full w-full max-w-17rem flex-col items-stretch select-none group relative"
    >
      <div className={`flex h-full flex-col overflow-hidden rounded-[1.3rem] border border-neutral-800 bg-neutral-900 transition-all duration-300 ${isPreviewing ? "border-yellow-500/30 shadow-[0_0_0_1px_rgba(234,179,8,0.15)]" : isDimmed ? "border-neutral-800/70" : "border-neutral-800"}`}>
        <div className={`relative h-56 w-full overflow-hidden bg-neutral-950 transition-all duration-500 ${isPreviewing ? "h-64" : "h-56"}`}>
          {isPreviewing && trailerUrl ? (
            <div className="absolute inset-0">
              <iframe
                src={trailerUrl}
                title={`${title} trailer`}
                className="h-full w-full"
                allow="autoplay; fullscreen; encrypted-media"
                allowFullScreen
              />
            </div>
          ) : (
            <img
              src={posterUrl}
              alt={title}
              className="h-full w-full object-cover opacity-85 transition-transform duration-500 group-hover:scale-105"
            />
          )}

          <div className={`absolute inset-0 transition-all duration-300 ${isPreviewing ? "bg-linear-to-t from-neutral-950 via-neutral-950/45 to-neutral-900/25" : "bg-linear-to-t from-neutral-900 via-transparent to-neutral-950/40"}`} />

          {isPreviewing && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute inset-x-0 bottom-0 bg-linear-to-t from-neutral-950 via-neutral-950/80 to-transparent px-3 py-3"
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-yellow-400">Preview en vivo</p>
              <p className="mt-1 text-[11px] text-neutral-200">{title}</p>
            </motion.div>
          )}

          <div className="absolute left-3 top-3 flex items-center gap-1.5">
            <Badge variant="genre" text={genre} />
            {movie.status === "coming-soon" && <Badge variant="pre-purchase" text="Precompra" />}
          </div>
          <Badge variant="rating" text={rating} ratingType={rating} className="absolute right-3 top-3" />
        </div>

        <div className="flex flex-1 flex-col gap-3 bg-neutral-900/95 p-4">
          <div>
            <h2 className="text-base font-semibold text-neutral-100 leading-snug line-clamp-1 group-hover:text-yellow-400 transition-colors">
              {title}
            </h2>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-neutral-400">
              {duration} • {genre}
            </p>
          </div>

          <p className="text-[11px] leading-relaxed text-neutral-400 line-clamp-3">
            {synopsis}
          </p>

          <div className="mt-auto space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {showtimes.map((time, index) => {
                const available = isTimeAvailable(time, index);
                const isSelected = selectedTime === time;
                return (
                  <button
                    key={index}
                    disabled={!available}
                    onClick={() => setSelectedTime(time)}
                    className={`rounded-lg border px-2.5 py-1.5 text-[10px] font-mono font-bold transition-all duration-150 ${
                      !available
                        ? "cursor-not-allowed border-neutral-900 bg-neutral-950 text-neutral-600 line-through"
                        : isSelected
                        ? "border-yellow-500 bg-yellow-500 text-neutral-950 shadow-md shadow-yellow-500/10"
                        : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-yellow-500/30 hover:text-yellow-400"
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>

            <Link
              to={`/movies/${movie.id}`}
              className="flex w-full items-center justify-center rounded-xl border border-neutral-700 bg-neutral-800/80 px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-300 transition-all hover:border-yellow-500/40 hover:bg-neutral-800 hover:text-yellow-400"
            >
              View details
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
