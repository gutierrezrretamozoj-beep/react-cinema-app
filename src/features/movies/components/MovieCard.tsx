import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "./Badge";
import type { Movie } from "../data/movieData";

interface MovieCardProps {
  movie: Movie;
  onBuy?: (movie: Movie, selectedTime: string) => void;
  isDimmed?: boolean;
  onPreviewChange?: (movieId: string | null) => void;
}

export const MovieCard = ({ movie, onBuy, isDimmed = false, onPreviewChange }: MovieCardProps) => {
  const { id, title, genre, rating, posterUrl, duration, synopsis, showtimes, trailerUrl } = movie;
  const navigate = useNavigate();

  const [selectedTime, setSelectedTime] = useState<string | null>(showtimes[0] ?? null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isPeeling, setIsPeeling] = useState(false);
  const [isTearing, setIsTearing] = useState(false);
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

  const handleBuy = () => {
    if (!selectedTime || isPeeling) return;

    setIsTearing(true);

    setTimeout(() => {
      setIsPeeling(true);
    }, 50);

    setTimeout(() => {
      onBuy?.(movie, selectedTime);
      navigate(`/movies/${id}/seats?time=${encodeURIComponent(selectedTime)}`);
    }, 1400);
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
                    disabled={!available || isPeeling}
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
              Ver detalles
            </Link>
          </div>
        </div>
      </div>

      <div className="relative w-full h-6 bg-neutral-900 flex items-center justify-between z-10 overflow-visible">
        <div className="absolute -left-3 h-6 w-6 rounded-full bg-neutral-950 z-20" />

        {!isTearing && (
          <div className="flex-1 border-b-2 border-dashed border-neutral-800/80 mx-3" />
        )}

        {isTearing && (
          <svg
            className="absolute inset-x-3 top-1/2 -translate-y-1/2 overflow-visible"
            height="10"
            style={{ width: 'calc(100% - 1.5rem)' }}
            preserveAspectRatio="none"
          >
            <motion.path
              d="M0,5 L14,2 L28,8 L42,1 L56,7 L70,2 L84,9 L98,3 L112,7 L126,1 L140,8 L154,3 L168,7 L182,2 L196,8 L210,3 L224,7 L238,2 L252,6 L266,1 L280,5"
              fill="none"
              stroke="rgba(234,179,8,0.55)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.32, ease: "easeInOut" }}
              style={{ vectorEffect: 'non-scaling-stroke' }}
            />
            <motion.path
              d="M0,5 L14,2 L28,8 L42,1 L56,7 L70,2 L84,9 L98,3 L112,7 L126,1 L140,8 L154,3 L168,7 L182,2 L196,8 L210,3 L224,7 L238,2 L252,6 L266,1 L280,5"
              fill="none"
              stroke="rgba(0,0,0,0.4)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 0.32, ease: "easeInOut", delay: 0.02 }}
              style={{ vectorEffect: 'non-scaling-stroke' }}
            />
          </svg>
        )}

        <div className="absolute -right-3 h-6 w-6 rounded-full bg-neutral-950 z-20" />
      </div>

      <div className="w-full h-20 relative z-0" style={{ perspective: '600px', perspectiveOrigin: '50% 0%' }}>
        <AnimatePresence>
          {!isPeeling ? (
            <motion.div
              key="stub-button"
              initial={{ rotateX: 0, rotateY: 0, rotateZ: 0, scaleX: 1, x: 0, y: 0, opacity: 1 }}
              exit={{
                scaleX:  [1, 0.75, 0.45, 0.15, 0],
                rotateY: [0, -90, -180, -270, -360],
                rotateZ: [0, 8, 15, 8, 0],
                x:       [0, 12, 32, 55, 75],
                y:       [0, -4, -8, -2, 10],
                opacity: [1, 1, 0.95, 0.8, 0],
              }}
              transition={{
                duration: 1.1,
                times: [0, 0.25, 0.5, 0.75, 1],
                ease: "easeInOut"
              }}
              style={{ 
                transformOrigin: 'right center', 
                transformStyle: 'preserve-3d'
              }}
              className="absolute inset-0 w-full bg-neutral-900 border-x border-b border-neutral-800 rounded-b-2xl p-4 flex items-center justify-center shadow-md overflow-hidden"
            >
              <motion.div
                initial={{ opacity: 0 }}
                exit={{ opacity: 0.8 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-linear-to-tr from-black/90 via-black/45 to-transparent pointer-events-none"
              />

              <button
                onClick={handleBuy}
                disabled={!selectedTime}
                className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md relative z-10 ${
                  !selectedTime
                    ? 'bg-neutral-950 border border-neutral-900 text-neutral-600 cursor-not-allowed'
                    : 'bg-yellow-500 hover:bg-yellow-400 text-neutral-950 active:scale-95 hover:shadow-lg hover:shadow-yellow-500/20'
                }`}
              >
                {movie.status === 'coming-soon' ? 'Precomprar Ticket' : 'Comprar Ticket'}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="stub-confirmed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="absolute inset-0 w-full bg-neutral-900/30 border-x border-b border-dashed border-neutral-800/80 rounded-b-2xl p-2.5 flex flex-col items-center justify-center gap-1.5"
            >
              <svg className="w-10 h-10 text-yellow-500/80 opacity-80" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 2h6v6H2V2zm1 1v4h4V3H3zm1 1h2v2H4V4zM16 2h6v6h-6V2zm1 1v4h4V3h-3zm1 1h2v2h-2V4zM2 16h6v6H2v-6zm1 1v4h4V3H3zm1 1h2v2H4v-2z" />
                <path d="M12 2h2v2h-2zm0 4h2v2h-2zm4 8h2v2h-2zm4 0h2v2h-2zm-8 4h2v2h-2zm4 4h2v2h-2zm-8-4h2v2H8zm4-8h2v2h-2zm8 4h2v2h-2z" />
                <path d="M10 10h2v2h-2zm2 2h2v2h-2zm-2 2h2v2h-2zm6-4h2v2h-2zm2 2h2v2h-2zm-4 4h2v2h-2z" />
              </svg>
              <div className="flex flex-col items-center text-center">
                <span className="text-[8px] font-bold text-neutral-200 uppercase tracking-widest leading-none">TICKET COMPRADO • {selectedTime}</span>
                <span className="text-[7.5px] text-neutral-400 mt-1 max-w-190px leading-tight">Escanea el código o revisa tu correo para ver tu boleto.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
