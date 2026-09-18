import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { getRatingBadgeProps, type Movie } from "../data/movieData";

interface MovieCardProps {
  movie: Movie;
  onBuy?: (movie: Movie, selectedTime: string) => void;
  isDimmed?: boolean;
  onPreviewChange?: (movieId: string | null) => void;
}

// Formateador de URL para reproducción de tráiler automática y en bucle mudo
const formatAutoplayUrl = (url?: string) => {
  if (!url) return "";
  let finalUrl = url;
  if (!finalUrl.includes("autoplay=1")) {
    finalUrl += `${finalUrl.includes("?") ? "&" : "?"}autoplay=1`;
  }
  if (!finalUrl.includes("mute=1") && !finalUrl.includes("muted=1")) {
    finalUrl += "&mute=1";
  }
  if (!finalUrl.includes("controls=")) {
    finalUrl += "&controls=0";
  }
  if (!finalUrl.includes("playsinline=")) {
    finalUrl += "&playsinline=1";
  }
  if (!finalUrl.includes("modestbranding=")) {
    finalUrl += "&modestbranding=1";
  }
  if (!finalUrl.includes("rel=")) {
    finalUrl += "&rel=0";
  }
  return finalUrl;
};

// MovieCard: Tarjeta cinematográfica que se ensancha en hover con mini-tráiler 16:9 panorámico sin recorte
export const MovieCard = ({
  movie,
  isDimmed = false,
  onPreviewChange,
}: MovieCardProps) => {
  const [isPreviewing, setIsPreviewing] = useState(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ratingProps = getRatingBadgeProps(movie.rating);
  const PREVIEW_DELAY = 350;

  const clearHoverTimer = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearHoverTimer();
  }, []);

  const handleMouseEnter = () => {
    clearHoverTimer();
    hoverTimerRef.current = setTimeout(() => {
      setIsPreviewing(true);
      onPreviewChange?.(movie.id);
    }, PREVIEW_DELAY);
  };

  const handleMouseLeave = () => {
    clearHoverTimer();
    setIsPreviewing(false);
    onPreviewChange?.(null);
  };

  const hasActiveTrailer = isPreviewing && Boolean(movie.trailerUrl);

  return (
    // Contenedor ancla en el grid para preservar el flujo exacto de las columnas sin saltos
    <div className="relative w-full aspect-2/3 select-none">
      <motion.div
        layout
        id={`movie-card-${movie.id}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={
          hasActiveTrailer
            ? {
                width: "155%",
                left: "-27.5%",
                top: "-20px",
                height: "auto",
                zIndex: 50,
                boxShadow:
                  "0 25px 60px -15px rgba(0,0,0,0.95), 0 0 25px rgba(0,255,204,0.3)",
              }
            : {
                width: "100%",
                left: "0%",
                top: "0px",
                height: "100%",
                zIndex: 10,
                boxShadow: "0 8px 20px -5px rgba(0,0,0,0.5)",
              }
        }
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className={`absolute rounded-2xl overflow-hidden border transition-colors duration-300 ${
          hasActiveTrailer
            ? "border-cinema-turquoise/50 bg-neutral-950"
            : "h-full border-white/10 bg-cinema-surface/75 hover:border-cinema-turquoise/40 hover:-translate-y-1.5"
        } ${isDimmed && !hasActiveTrailer ? "opacity-50 blur-[0.3px]" : "opacity-100"}`}
      >
        <Link to={`/movies/${movie.id}`} className="flex flex-col w-full h-full cursor-pointer">
          {/* ESTADO 1: Tráiler Activo Panorámico 16:9 (Completamente sin recortes) */}
          {hasActiveTrailer ? (
            <div className="flex flex-col w-full bg-neutral-950">
              {/* Contenedor de video 16:9 panorámico nativo */}
              <div className="relative w-full aspect-video overflow-hidden bg-black">
                <iframe
                  src={formatAutoplayUrl(movie.trailerUrl)}
                  title={`${movie.title} tráiler`}
                  className="w-full h-full object-cover border-0 pointer-events-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
                <div className="absolute top-2.5 left-3 flex items-center gap-1.5 bg-neutral-950/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                  <span className="h-1.5 w-1.5 rounded-full bg-cinema-turquoise animate-pulse" />
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-cinema-turquoise">
                    Tráiler
                  </span>
                </div>
              </div>

              {/* Panel inferior expandido con título, métricas y botón */}
              <div className="p-3.5 flex flex-col gap-2 bg-linear-to-b from-neutral-950 via-neutral-900 to-neutral-950 border-t border-white/10">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-snug drop-shadow line-clamp-1">
                    {movie.title}
                  </h4>
                  {movie.averageRating && (
                    <span className="text-[10px] font-mono font-bold text-cinema-gold shrink-0">
                      {movie.averageRating} ★
                    </span>
                  )}
                </div>

                {/* Métricas compactas */}
                <div className="flex items-center gap-2 text-[10px] text-white/80">
                  <span className="font-mono">{movie.duration}</span>
                  <span className="text-white/30">•</span>
                  <span className="text-cinema-turquoise font-mono uppercase font-semibold">
                    {movie.genre}
                  </span>
                  <span className="text-white/30">•</span>
                  <span
                    className={`text-[8.5px] font-bold px-1.5 py-0.2 rounded-md ${ratingProps.badgeClass}`}
                  >
                    {ratingProps.label}
                  </span>
                </div>

                {/* Botón Ver Detalles */}
                <div className="pt-1 flex items-center justify-between">
                  <div className="relative group/btn inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-cinema-turquoise transition-all">
                    <span>Ver detalles</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.91 19.92l6.52-6.52a1.5 1.5 0 000-2.12L8.91 4.08" />
                    </svg>
                    <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-cinema-turquoise/50" />
                  </div>

                  <span className="text-[9px] text-neutral-400 font-mono">
                    Toca para horarios
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* ESTADO 2: Tarjeta Vertical en Reposo (Full-Bleed 2:3) */
            <div className="relative w-full h-full">
              {/* Póster a sangre completa */}
              <img
                src={movie.posterUrl}
                alt={movie.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />

              {/* Badge sutil de clasificación en reposo */}
              <div className="absolute top-2.5 right-2.5 z-5 pointer-events-none">
                <span
                  className={`text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-md ${ratingProps.badgeClass}`}
                >
                  {ratingProps.label}
                </span>
              </div>

              {/* Capa de oscurecimiento suave en hover previo a la expansión del tráiler */}
              <div className="absolute inset-0 z-10 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/75 backdrop-blur-[2px] flex flex-col justify-between p-3.5 text-center">
                <div className="pt-1">
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-snug drop-shadow line-clamp-2">
                    {movie.title}
                  </h4>
                </div>

                <div className="my-auto flex flex-col items-center gap-1.5">
                  <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs">
                    <span className="font-mono text-white/90 font-medium">
                      {movie.duration}
                    </span>
                    <span className="text-white/40">|</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${ratingProps.badgeClass}`}
                    >
                      {ratingProps.label}
                    </span>
                  </div>

                  <span className="text-[10px] text-cinema-turquoise uppercase tracking-widest font-mono font-semibold">
                    {movie.genre}
                  </span>
                </div>

                <div className="pb-1 flex justify-center">
                  <div className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase text-white/90">
                    <span>Ver detalles</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="w-3 h-3 text-cinema-turquoise"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.91 19.92l6.52-6.52a1.5 1.5 0 000-2.12L8.91 4.08" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Link>
      </motion.div>
    </div>
  );
};
