import { Link } from "react-router";
import type { Movie } from "@/features/movies/data/movieData";
import { Badge } from "@/features/movies/components/Badge";

interface MovieRowCardProps {
  movie: Movie;
}

// MovieRowCard: Tarjeta vertical diseñada fielmente al boceto (Movie img + View det)
export const MovieRowCard = ({ movie }: MovieRowCardProps) => {
  return (
    <div className="flex-none w-[220px] sm:w-[240px] flex flex-col rounded-2xl overflow-hidden border border-neutral-800/80 bg-neutral-900/70 transition-all duration-300 hover:border-yellow-500/50 hover:shadow-xl hover:shadow-yellow-500/10 hover:-translate-y-1 group">
      
      {/* Contenedor del póster (Movie img) */}
      <div className="relative aspect-2/3 w-full overflow-hidden bg-neutral-950">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradientes de contraste */}
        <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-transparent to-neutral-950/30" />

        {/* Badges superiores */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <Badge variant="genre" text={movie.genre} />
        </div>
        <Badge
          variant="rating"
          text={movie.rating}
          ratingType={movie.rating}
          className="absolute top-2.5 right-2.5"
        />

        {/* Duración en la base del póster */}
        <div className="absolute bottom-2.5 left-2.5 bg-neutral-950/80 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-mono text-neutral-300">
          {movie.duration}
        </div>
      </div>

      {/* Contenido inferior: Título y botón "View det" (Ver detalle) */}
      <div className="p-3.5 flex flex-col flex-1 gap-2 bg-neutral-900/90">
        <h4 className="text-sm font-bold text-neutral-100 line-clamp-1 group-hover:text-yellow-400 transition-colors">
          {movie.title}
        </h4>

        <div className="mt-auto pt-1.5">
          <Link
            to={`/movies/${movie.id}`}
            className="flex items-center justify-center w-full py-2 px-3 rounded-xl border border-neutral-700 bg-neutral-800/90 text-xs font-bold uppercase tracking-wider text-neutral-200 transition-all hover:border-yellow-500 hover:bg-yellow-500 hover:text-neutral-950 active:scale-98"
          >
            Ver detalles
          </Link>
        </div>
      </div>
    </div>
  );
};
