import type { Movie } from "@/features/auth/pages/Home/data/movieData";
import type { MovieListItem, MovieDetail } from "@/shared/interfaces/movie";
import type { Showtime } from "@/shared/interfaces/showtime";

/**
 * Maps backend status to local status values.
 * @param status - Backend status string
 * @returns Normalized local status
 */
function mapStatus(status: string): Movie["status"] {
  const normalized = status.toUpperCase();
  if (normalized === "NOW_SHOWING" || normalized === "NOW-PLAYING" || normalized === "EN_CARTELERA") return "now-playing";
  return "coming-soon";
}

/**
 * Converts duration in minutes to display string.
 * @param minutes - Duration in minutes
 * @returns Formatted duration string
 */
function formatDuration(minutes: number): string {
  return `${minutes} min`;
}

/**
 * Maps a MovieListItem from the API to the local Movie model with sensible defaults.
 * @param item - Backend movie summary
 * @returns Local Movie
 */
export function mapMovieListItemToMovie(item: MovieListItem): Movie {
  return {
    id: item.id,
    title: item.title,
    genre: "Acción",
    rating: "B",
    status: mapStatus(item.status),
    posterUrl: item.posterUrl,
    backdropUrl: item.posterUrl,
    featured: item.isRelease ?? false,
    duration: formatDuration(item.durationMinutes),
    synopsis: "Sinopsis no disponible para esta película.",
    showtimes: ["14:30", "17:45", "21:00"],
    trailerUrl: undefined,
    director: undefined,
    cast: [],
    releaseDate: item.releaseDate,
    languages: [],
    formats: [],
    prices: [],
    averageRating: item.publicRating ? `${item.publicRating}/5` : undefined,
  };
}

/**
 * Maps a detailed backend movie to the local Movie model.
 * @param detail - Backend movie detail
 * @returns Local Movie enriched with detail data
 */
export function mapMovieDetailToMovie(detail: MovieDetail, fallback?: Movie): Movie {
  return {
    id: detail.id,
    title: detail.title,
    genre: (detail.genres[0]?.name as Movie["genre"]) ?? fallback?.genre ?? "Acción",
    rating: (detail.rating.code as Movie["rating"]) ?? fallback?.rating ?? "B",
    status: fallback?.status ?? "now-playing",
    posterUrl: detail.posterUrl ?? fallback?.posterUrl ?? "",
    backdropUrl: detail.bannerUrl ?? detail.posterUrl ?? fallback?.backdropUrl ?? "",
    featured: fallback?.featured ?? false,
    duration: formatDuration(detail.durationMinutes),
    synopsis: detail.synopsis ?? fallback?.synopsis ?? "",
    showtimes: fallback?.showtimes ?? ["14:30", "17:45", "21:00"],
    trailerUrl: detail.trailerUrl ?? fallback?.trailerUrl,
    director: detail.director ?? fallback?.director,
    cast: detail.cast.map((c) => c.actorName) ?? fallback?.cast,
    releaseDate: detail.releaseDate ?? fallback?.releaseDate,
    languages: fallback?.languages,
    formats: fallback?.formats,
    prices: fallback?.prices,
    averageRating: `${detail.publicRating}/5`,
  };
}

/**
 * Extracts display times from showtime startTime ISO strings.
 * @param showtimes - Backend showtimes
 * @returns Array of HH:mm formatted times
 */
export function extractShowtimeHours(showtimes: Showtime[]): string[] {
  return showtimes.map((s) => {
    const date = new Date(s.startTime);
    return date.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", hour12: false });
  });
}
