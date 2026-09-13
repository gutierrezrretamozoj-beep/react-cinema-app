import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { MOVIES } from "../Home/data/movieData";
import type { Movie } from "../Home/data/movieData";
import { useCart } from "@/features/cart/CartContext";
import { movieService } from "@/features/movies/services/movie.service";
import { mapMovieDetailToMovie, extractShowtimeHours } from "@/features/movies/utils/mappers";
import type { Showtime } from "@/shared/interfaces/showtime";

/**
 * Movie detail page with real backend integration and offline fallback.
 * @returns JSX element
 */
export const MovieDescriptionPage = () => {
  const { movieId } = useParams();
  const { addMovieToCart } = useCart();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useEffect(() => {
    if (!movieId) return;
    let mounted = true;
    const fallback = MOVIES.find((item) => item.id === movieId) ?? null;

    setLoading(true);
    movieService
      .getById(movieId)
      .then((detail) => {
        if (!mounted) return;
        const mapped = mapMovieDetailToMovie(detail, fallback ?? undefined);
        setMovie(mapped);
        setIsOffline(false);
        setSelectedTime(mapped.showtimes[0] ?? null);
      })
      .catch(() => {
        if (!mounted) return;
        if (fallback) {
          setMovie(fallback);
          setSelectedTime(fallback.showtimes[0] ?? null);
        } else {
          setMovie(null);
        }
        setIsOffline(true);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    movieService
      .getShowtimes(movieId)
      .then((data) => {
        if (!mounted) return;
        setShowtimes(data);
        const hours = extractShowtimeHours(data);
        if (hours.length > 0) setSelectedTime(hours[0]);
      })
      .catch(() => {
        if (!mounted) return;
        setShowtimes([]);
      });

    return () => {
      mounted = false;
    };
  }, [movieId]);

  /**
   * Handles ticket purchase.
   */
  const handleBuyTickets = async () => {
    if (!movie || !selectedTime) return;
    await addMovieToCart(movie, selectedTime);
  };

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center px-6 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-700 border-t-yellow-500" />
        <p className="mt-4 text-sm text-neutral-400">Cargando película...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-semibold text-neutral-100">Película no encontrada</h1>
        <p className="mt-2 text-sm text-neutral-400">No se pudo encontrar la película seleccionada.</p>
        <Link to="/home" className="mt-6 rounded-full border border-neutral-700 px-4 py-2 text-sm text-neutral-300 transition hover:border-yellow-500/40 hover:text-yellow-400">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const displayShowtimes = showtimes.length > 0 ? extractShowtimeHours(showtimes) : movie.showtimes;
  const recommendations = MOVIES.filter((item) => item.id !== movie.id).slice(0, 3);

  return (
    <div className="flex w-full flex-col gap-4 overflow-x-hidden px-3 py-4 sm:gap-6 sm:px-4 sm:py-6 md:gap-8 md:px-8 lg:px-10">
      {isOffline && (
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-400">
          Modo offline — detalles locales para esta película.
        </div>
      )}

      <div className="w-full overflow-hidden rounded-1.5rem border border-neutral-800 bg-neutral-900 shadow-2xl shadow-black/30 sm:rounded-2rem">
        <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative min-h-220px sm:min-h-280px lg:min-h-360px">
            <img src={movie.backdropUrl} alt={movie.title} className="h-220px w-full object-cover sm:h-280px lg:h-full" />
            <div className="absolute inset-0 bg-linear-to-r from-neutral-950 via-neutral-950/70 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 md:p-8">
              <p className="mb-2 inline-flex w-fit rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.3em] text-yellow-400 sm:mb-3 sm:px-3 sm:py-1 sm:text-[10px]">
                {movie.status === "coming-soon" ? "Próximamente" : "En cartelera"}
              </p>
              <h1 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">{movie.title}</h1>
              <p className="mt-2 max-w-2xl text-xs leading-6 text-neutral-300 sm:mt-3 sm:text-sm sm:leading-7">{movie.synopsis}</p>
            </div>
          </div>

          <div className="flex flex-col justify-between bg-neutral-900/90 p-4 sm:p-6 md:p-8">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-neutral-700 px-2.5 py-1 text-[10px] uppercase tracking-[0.25em] text-neutral-400 sm:px-3 sm:text-[11px]">{movie.genre}</span>
                <span className="rounded-full border border-neutral-700 px-2.5 py-1 text-[10px] uppercase tracking-[0.25em] text-neutral-400 sm:px-3 sm:text-[11px]">{movie.rating}</span>
                <span className="rounded-full border border-neutral-700 px-2.5 py-1 text-[10px] uppercase tracking-[0.25em] text-neutral-400 sm:px-3 sm:text-[11px]">{movie.duration}</span>
              </div>

              <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
                <InfoBlock label="Director" value={movie.director ?? "—"} />
                <InfoBlock label="Fecha de estreno" value={movie.releaseDate ?? "—"} />
                <InfoBlock label="Idiomas" value={movie.languages?.join(", ") ?? "—"} />
                <InfoBlock label="Formatos" value={movie.formats?.join(", ") ?? "—"} />
                <InfoBlock label="Precios" value={movie.prices?.join(" • ") ?? "—"} />
                <InfoBlock label="Calificación promedio" value={movie.averageRating ?? "—"} />
                <InfoBlock label="Clasificación" value={movie.rating} />
                <InfoBlock label="Estado" value={movie.status === "coming-soon" ? "Próximamente" : "En cartelera"} />
                <InfoBlock label="Reparto" value={(movie.cast ?? []).slice(0, 3).join(" • ") || "—"} />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
              <Link to="/home" className="rounded-full border border-neutral-700 px-3 py-2 text-xs text-neutral-300 transition hover:border-yellow-500/40 hover:text-yellow-400 sm:px-4 sm:py-2 sm:text-sm">
                Volver al catálogo
              </Link>
              <button onClick={handleBuyTickets} className="rounded-full bg-yellow-500 px-3 py-2 text-xs font-semibold text-neutral-950 transition hover:bg-yellow-400 sm:px-4 sm:py-2 sm:text-sm">
                Comprar entradas
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid min-w-0 gap-4 sm:gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="min-w-0 rounded-[1.25rem] border border-neutral-800 bg-neutral-900/80 p-4 sm:rounded-1.5rem sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white sm:text-xl">Funciones y reserva</h2>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
            {displayShowtimes.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`rounded-full px-3 py-2 text-sm font-semibold transition ${selectedTime === time ? "bg-yellow-500 text-neutral-950" : "border border-neutral-700 bg-neutral-950/50 text-neutral-300 hover:border-yellow-500/40 hover:text-yellow-400"}`}
              >
                {time}
              </button>
            ))}
          </div>

          {showtimes.length > 0 && (
            <div className="mt-4 grid gap-2">
              {showtimes.slice(0, 3).map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950/40 px-3 py-2 text-xs text-neutral-400">
                  <span>
                    {s.cinema.name} • {s.room.name} ({s.room.format})
                  </span>
                  <span className="font-mono text-yellow-400">${s.basePrice.toLocaleString("es-CO")}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 rounded-2xl border border-neutral-800 bg-neutral-950/60 p-3 sm:mt-6 sm:p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500">Sesión seleccionada</p>
            <p className="mt-2 text-base font-semibold text-white sm:text-lg">{selectedTime ?? "Elige una hora"}</p>
            <p className="mt-2 text-xs leading-5 text-neutral-400 sm:text-sm">Reserva tu asiento y disfruta del mejor formato disponible para esta película.</p>
          </div>
        </section>

        <section className="min-w-0 rounded-[1.25rem] border border-neutral-800 bg-neutral-900/80 p-4 sm:rounded-1.5rem sm:p-6">
          <h2 className="text-lg font-semibold text-white sm:text-xl">Reparto</h2>
          <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
            {(movie.cast ?? []).length > 0 ? (
              (movie.cast ?? []).map((actor) => (
                <span key={actor} className="rounded-full border border-neutral-700 bg-neutral-950/60 px-3 py-1.5 text-sm text-neutral-300">
                  {actor}
                </span>
              ))
            ) : (
              <span className="text-sm text-neutral-400">Sin información del reparto.</span>
            )}
          </div>
        </section>
      </div>

      <section className="min-w-0 rounded-[1.25rem] border border-neutral-800 bg-neutral-900/80 p-4 sm:rounded-1.5rem sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-white sm:text-xl">Películas recomendadas</h2>
          <Link to="/home" className="text-xs text-neutral-400 transition hover:text-yellow-400 sm:text-sm">
            Ver todas
          </Link>
        </div>
        <div className="mt-4 grid gap-3 sm:mt-5 sm:gap-4 md:grid-cols-3">
          {recommendations.map((item) => (
            <Link key={item.id} to={`/movies/${item.id}`} className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-3 transition hover:border-yellow-500/40 sm:p-4">
              <img src={item.posterUrl} alt={item.title} className="h-28 w-full rounded-xl object-cover sm:h-36" />
              <p className="mt-3 text-sm font-semibold text-neutral-100">{item.title}</p>
              <p className="mt-2 text-xs leading-5 text-neutral-400 sm:text-sm">{item.synopsis}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

/**
 * Simple block displaying a label/value pair.
 * @param props - Component props
 * @param props.label - Field label
 * @param props.value - Field value
 * @returns JSX element
 */
const InfoBlock = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3">
    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500">{label}</p>
    <p className="mt-1 text-sm text-neutral-200">{value}</p>
  </div>
);
