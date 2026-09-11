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
          <span className="h-2 w-2 rounded-full bg-yellow-500 animate-ping" />
          <span className="text-xs font-bold uppercase tracking-widest text-yellow-500">Próximos Lanzamientos</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-neutral-100 tracking-tight">
          Muy Pronto en Nuestras Salas
        </h1>
        <p className="text-sm text-neutral-400 max-w-2xl">
          Conoce los títulos más esperados que llegarán a nuestras pantallas en las próximas semanas. Reserva tu lugar en preventa exclusiva.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {comingSoonMovies.map((movie) => (
          <div
            key={movie.id}
            className="flex flex-col rounded-2xl overflow-hidden border border-neutral-800/80 bg-neutral-900/60 transition-all hover:border-yellow-500/40 hover:shadow-2xl hover:shadow-yellow-500/5 group"
          >
            <div className="relative aspect-2/3 w-full overflow-hidden bg-neutral-950">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-transparent to-neutral-950/40" />
              
              <div className="absolute top-3 left-3 flex gap-1.5 items-center">
                <Badge variant="genre" text={movie.genre} />
                <Badge variant="pre-purchase" text="Preventa" />
              </div>
              <Badge variant="rating" text={movie.rating} ratingType={movie.rating} className="absolute top-3 right-3" />

              {movie.releaseDate && (
                <div className="absolute bottom-3 left-3 bg-neutral-900/90 backdrop-blur-md px-3 py-1 rounded-lg border border-neutral-700/60">
                  <span className="text-[10px] font-mono font-bold text-yellow-400">
                    Estreno: {movie.releaseDate}
                  </span>
                </div>
              )}
            </div>

            <div className="p-4 flex flex-col flex-1 gap-2">
              <h3 className="text-base font-bold text-neutral-100 group-hover:text-yellow-400 transition-colors line-clamp-1">
                {movie.title}
              </h3>
              <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                {movie.synopsis}
              </p>
              <div className="mt-auto pt-3">
                <Link
                  to={`/movies/${movie.id}`}
                  className="flex items-center justify-center w-full py-2.5 rounded-xl border border-neutral-700 bg-neutral-800/80 text-xs font-bold uppercase tracking-wider text-neutral-200 hover:border-yellow-500 hover:bg-yellow-500 hover:text-neutral-950 transition-all"
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
