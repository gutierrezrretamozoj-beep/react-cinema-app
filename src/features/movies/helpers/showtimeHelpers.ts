import type { Movie, Showtime } from "../interfaces";

/**
 * Returns only the active showtimes of a movie.
 *
 * Inactive showtimes (cancelled sessions) are removed from the returned array.
 *
 * @param movie - The movie whose showtimes are inspected.
 * @returns The list of active showtimes.
 */
export function getActiveShowtimes(movie: Movie): Showtime[] {
  return movie.showtimes.filter((showtime) => showtime.isActive);
}

/**
 * Checks whether a specific showtime of a movie is sold out.
 *
 * @param movie - The movie to inspect.
 * @param time - The showtime to check, in HH:MM format.
 * @returns `true` when the showtime exists and is sold out, `false` otherwise.
 */
export function isShowtimeSoldOut(movie: Movie, time: string): boolean {
  const showtime = movie.showtimes.find((item) => item.time === time);
  return showtime?.isSoldOut ?? false;
}

/**
 * Removes movies that have no active showtimes left.
 *
 * @param movies - The full movie dataset.
 * @returns The dataset filtered by movies with at least one active showtime.
 */
export function filterInactiveMovies(movies: Movie[]): Movie[] {
  return movies.filter((movie) => getActiveShowtimes(movie).length > 0);
}

/**
 * Normalizes a movie dataset by excluding inactive showtimes and dropping
 * movies with no active sessions, while preserving sold-out flags.
 *
 * @param movies - The raw movie dataset.
 * @returns The business-ready dataset for listings.
 */
export function normalizeActiveMovies(movies: Movie[]): Movie[] {
  return movies
    .map((movie) => ({ ...movie, showtimes: getActiveShowtimes(movie) }))
    .filter((movie) => movie.showtimes.length > 0);
}