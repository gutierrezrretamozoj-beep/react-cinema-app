export type MovieStatus = "now-playing" | "coming-soon";
export type MovieGenre = "Acción" | "Drama" | "Sci-Fi" | "Thriller" | "Terror";
export type MovieRating = "A" | "B" | "B15" | "C";

export interface Showtime {
  id: string;
  time: string;
  isActive: boolean;
  isSoldOut: boolean;
}

export interface Movie {
  id: string;
  title: string;
  genre: MovieGenre;
  rating: MovieRating;
  status: MovieStatus;
  posterUrl: string;
  backdropUrl: string;
  featured: boolean;
  duration: string;
  synopsis: string;
  showtimes: Showtime[];

  trailerUrl?: string;
  director?: string;
  cast?: string[];
  releaseDate?: string;
  languages?: string[];
  formats?: string[];
  prices?: string[];
  averageRating?: string;
}

export interface MovieFilters {
  status: MovieStatus | null;
  genre: MovieGenre | null;
  timeSlot: string | null;
}

export interface ListingsParams {
  city: string;
  status?: MovieStatus;
  genre?: MovieGenre;
  timeSlot?: string;
}

export interface ListingsResponse {
  success: boolean;
  city: string;
  total: number;
  movies: Movie[];
  filters?: MovieFilters;
}