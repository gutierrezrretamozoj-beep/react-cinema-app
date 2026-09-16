import { Link } from "react-router";
import { getRatingBadgeProps, type Movie } from "@/features/movies/data/movieData";

interface MovieRowCardProps {
  movie: Movie;
}

// MovieRowCard: Tarjeta cinematográfica a sangre (Full-Bleed) basada en el boceto a mano
export const MovieRowCard = ({ movie }: MovieRowCardProps) => {
  const ratingProps = getRatingBadgeProps(movie.rating);

  return (
    <Link
      to={`/movies/${movie.id}`}
      className="group/card relative flex-none w-41.25 sm:w-55 md:w-60 aspect-2/3 rounded-2xl overflow-hidden border border-white/10 bg-cinema-surface/75 shadow-lg transition-all duration-300 hover:border-white/25 hover:shadow-2xl hover:shadow-black/70 hover:-translate-y-1.5 cursor-pointer select-none"
    >
      {/* 1. Póster a sangre (Full-Bleed) */}
      <img
        src={movie.posterUrl}
        alt={movie.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
      />

      {/* 2. Capa de oscurecimiento interactiva (Boceto a mano: Título / dur | clas / Botón) */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] opacity-0 group-hover/card:opacity-100 transition-all duration-300 flex flex-col justify-between p-4 sm:p-5 text-center">
        
        {/* Título arriba */}
        <div className="pt-2">
          <h4 className="text-xs sm:text-sm md:text-base font-bold text-white leading-snug wrap-break-word drop-shadow-sm">
            {movie.title}
          </h4>
        </div>

        {/* Centro: dur | clas */}
        <div className="my-auto flex flex-col items-center gap-2">
          <div className="flex items-center justify-center gap-2 text-[11px] sm:text-xs">
            <span className="font-mono text-white/90 font-medium">
              {movie.duration}
            </span>
            <span className="text-white/40">|</span>
            <span
              className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md ${ratingProps.badgeClass}`}
            >
              {ratingProps.label}
            </span>
          </div>

          <span className="text-[10px] text-white/50 uppercase tracking-widest font-mono">
            {movie.genre}
          </span>
        </div>

        {/* Abajo: Botón interactivo animado (Uiverse adaptado con línea y flecha) */}
        <div className="pb-1 flex justify-center">
          <div className="relative group/btn inline-flex items-center gap-2 py-1 text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-white/80 transition-all duration-300 group-hover/btn:text-white group-hover/btn:tracking-widest">
            <span>Ver más</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1 text-white"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.91 19.92l6.52-6.52a1.5 1.5 0 000-2.12L8.91 4.08" />
            </svg>
            {/* Línea animada inferior expansiva */}
            <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-white/70 transition-all duration-300 group-hover/btn:w-full" />
          </div>
        </div>

      </div>
    </Link>
  );
};
