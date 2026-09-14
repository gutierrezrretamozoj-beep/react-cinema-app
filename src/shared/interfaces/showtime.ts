/**
 * Cinema information embedded in a showtime.
 */
export interface ShowtimeCinema {
  id: number;
  name: string;
  city: string;
}

/**
 * Room information embedded in a showtime.
 */
export interface ShowtimeRoom {
  id: number;
  name: string;
  format: string;
}

/**
 * Showtime entity returned by GET /movies/:id/showtimes.
 */
export interface Showtime {
  id: string;
  movieId: string;
  cinema: ShowtimeCinema;
  room: ShowtimeRoom;
  language: string;
  isSubtitled: boolean;
  startTime: string;
  endTime: string;
  basePrice: number;
  availableSeats: number;
}
