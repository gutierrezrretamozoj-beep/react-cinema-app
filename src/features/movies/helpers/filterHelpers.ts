import type { Movie, MovieFilters, MovieGenre, MovieStatus } from "../interfaces";
import { getActiveShowtimes } from "./showtimeHelpers";

export const DEFAULT_GENRE: MovieGenre | null = null;

export const EMPTY_FILTERS: MovieFilters = {
  status: null,
  genre: null,
  timeSlot: null,
};

/**
 * Builds the filters object from a URLSearchParams instance.
 *
 * Only recognized keys are read, so unknown query parameters are ignored.
 *
 * @param params - The current URL search params.
 * @returns The normalized filters derived from the URL.
 */
export function filtersFromParams(params: URLSearchParams): MovieFilters {
  const rawStatus = params.get("status");
  const rawGenre = params.get("genre");
  const rawTimeSlot = params.get("timeSlot");

  const status = isMovieStatus(rawStatus) ? rawStatus : null;
  const genre = isMovieGenre(rawGenre) ? rawGenre : null;

  return { status, genre, timeSlot: rawTimeSlot };
}

/**
 * Serializes the filters into a plain object ready for URLSearchParams.
 *
 * @param filters - The filters to serialize.
 * @returns A flat object with only the active filter keys.
 */
export function filtersToParams(filters: MovieFilters): Record<string, string> {
  const params: Record<string, string> = {};

  if (filters.status) params.status = filters.status;
  if (filters.genre) params.genre = filters.genre;
  if (filters.timeSlot) params.timeSlot = filters.timeSlot;

  return params;
}

/**
 * Applies the filters over the movie dataset in real time.
 *
 * The status, genre and time slot conditions are all optional; an active
 * time slot only matches showtimes that are not sold out.
 *
 * @param movies - The normalized movie dataset.
 * @param filters - The filters to apply.
 * @returns The filtered movie list.
 */
export function applyFilters(movies: Movie[], filters: MovieFilters): Movie[] {
  return movies.filter((movie) => {
    const matchesStatus = !filters.status || movie.status === filters.status;
    const matchesGenre = !filters.genre || movie.genre === filters.genre;
    const matchesTimeSlot =
      !filters.timeSlot ||
      getActiveShowtimes(movie).some(
        (showtime) => showtime.time === filters.timeSlot && !showtime.isSoldOut
      );

    return matchesStatus && matchesGenre && matchesTimeSlot;
  });
}

/**
 * Indicates whether at least one filter is currently active.
 *
 * @param filters - The filters to inspect.
 * @returns `true` when any filter key has a value.
 */
export function hasActiveFilters(filters: MovieFilters): boolean {
  return Boolean(filters.status || filters.genre || filters.timeSlot);
}

function isMovieStatus(value: string | null): value is MovieStatus {
  return value === "now-playing" || value === "coming-soon";
}

function isMovieGenre(value: string | null): value is MovieGenre {
  return (
    value === "Acción" || value === "Drama" || value === "Sci-Fi" || value === "Thriller" || value === "Terror"
  );
}