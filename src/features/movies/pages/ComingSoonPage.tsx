import { Link } from "react-router";
import { MOVIES } from "../data/movieData";
import { Badge } from "../components/Badge";

// ComingSoonPage: Vista dedicada para próximos estrenos (/coming-movies)
export const ComingSoonPage = () => {
  const comingSoonMovies = MOVIES.filter((m) => m.status === "coming-soon");

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 sm:pt-8 pb-20">
      <div className="flex flex-col gap-2 mb-10 text-left">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cinema-turquoise animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-cinema-turquoise font-mono">Próximos Lanzamientos</span>
        </div>
        <h1 className="text-2xl sm:text-3.5xl font-extrabold text-cinema-text tracking-wider uppercase font-monument">
          Muy Pronto en Nuestras Salas
        </h1>
        <p className="text-sm text-cinema-muted max-w-2xl">
          Conoce los títulos más esperados que llegarán a nuestras pantallas en las próximas semanas. Reserva tu lugar en preventa exclusiva.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {comingSoonMovies.map((movie) => (
          <div
            key={movie.id}
            className="flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-cinema-surface/75 backdrop-blur-md transition-all hover:border-cinema-electric/40 hover:shadow-2xl hover:shadow-cinema-primary/20 group"
          >
            <div className="relative aspect-2/3 w-full overflow-hidden bg-[#060c18]">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-cinema-surface-card via-transparent to-[#060c18]/40" />
              
              <div className="absolute top-3 left-3 flex gap-1.5 items-center">
                <Badge variant="genre" text={movie.genre} />
                <Badge variant="pre-purchase" text="Preventa" />
              </div>
              <Badge variant="rating" text={movie.rating} ratingType={movie.rating} className="absolute top-3 right-3" />

              {movie.releaseDate && (
                <div className="absolute bottom-3 left-3 bg-cinema-surface/90 backdrop-blur-md px-3 py-1 rounded-lg border border-white/15">
                  <span className="text-[10px] font-mono font-bold text-cinema-electric">
                    Estreno: {movie.releaseDate}
                  </span>
                </div>
              )}
            </div>

            <div className="p-4 flex flex-col flex-1 gap-2">
              <h3 className="text-base font-bold text-cinema-text group-hover:text-cinema-electric transition-colors line-clamp-1">
                {movie.title}
              </h3>
              <p className="text-xs text-cinema-muted line-clamp-2 leading-relaxed">
                {movie.synopsis}
              </p>
              <div className="mt-auto pt-3">
                <Link
                  to={`/movies/${movie.id}`}
                  className="flex items-center justify-center w-full py-2.5 rounded-xl border border-white/15 bg-white/5 text-xs font-semibold uppercase tracking-wider text-cinema-text hover:border-cinema-electric/40 hover:bg-cinema-electric/10 hover:text-cinema-electric transition-all"
                >
                  Ver Ficha & Tráiler
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
