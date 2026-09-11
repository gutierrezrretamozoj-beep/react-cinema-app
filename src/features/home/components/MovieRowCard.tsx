import { Link } from "react-router";
import { getFriendlyRating, type Movie } from "@/features/movies/data/movieData";

interface MovieRowCardProps {
  movie: Movie;
}

// MovieRowCard: Tarjeta optimizada para móvil (20-25% más pequeña) con título completo y badges inferiores
export const MovieRowCard = ({ movie }: MovieRowCardProps) => {
  return (
    <div className="flex-none w-[165px] sm:w-[220px] md:w-[240px] flex flex-col rounded-2xl overflow-hidden border border-neutral-800/80 bg-neutral-900/70 transition-all duration-300 hover:border-yellow-500/50 hover:shadow-xl hover:shadow-yellow-500/10 hover:-translate-y-1 group">
      
      {/* Contenedor del póster (Limpio, sin badges superpuestos por pedido del usuario) */}
      <div className="relative aspect-2/3 w-full overflow-hidden bg-neutral-950">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradiente sutil inferior */}
        <div className="absolute inset-0 bg-linear-to-t from-neutral-950/80 via-transparent to-transparent" />
      </div>

      {/* Contenido inferior: Título con wrap completo, badges agrupados y botón */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 gap-2.5 bg-neutral-900/95 text-left">
        
        {/* Título de la película con wrap completo (sin truncar) */}
        <h4 className="text-xs sm:text-sm font-bold text-neutral-100 leading-snug break-words group-hover:text-yellow-400 transition-colors">
          {movie.title}
        </h4>

        {/* Badges agrupados juntos: Duración, Género y Clasificación sencilla */}
        <div className="flex flex-wrap items-center gap-1.5 text-[9px] sm:text-[10px]">
          <span className="font-mono text-neutral-400 font-medium">
            {movie.duration}
          </span>
          <span className="text-neutral-600">•</span>
          <span className="rounded-md bg-neutral-800/90 border border-neutral-700/60 px-2 py-0.5 text-neutral-300 font-medium">
            {movie.genre}
          </span>
          <span className="rounded-md bg-yellow-500/10 border border-yellow-500/30 px-2 py-0.5 text-yellow-400 font-semibold">
            {getFriendlyRating(movie.rating)}
          </span>
        </div>

        {/* Botón "Ver detalles" */}
        <div className="mt-auto pt-1.5">
          <Link
            to={`/movies/${movie.id}`}
            className="flex items-center justify-center w-full py-2 px-3 rounded-xl border border-neutral-700 bg-neutral-800/90 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-200 transition-all hover:border-yellow-500 hover:bg-yellow-500 hover:text-neutral-950 active:scale-98"
          >
            Ver detalles
          </Link>
        </div>

      </div>
    </div>
  );
};
