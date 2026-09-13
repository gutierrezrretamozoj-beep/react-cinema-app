/**
 * Movie summary returned by GET /movies.
 */
export interface MovieListItem {
  id: string;
  title: string;
  posterUrl: string;
  durationMinutes: number;
  releaseDate: string;
  publicRating: number;
  isRelease: boolean;
  status: string;
}

/**
 * Detailed movie data returned by GET /movies/:id.
 */
export interface MovieDetail {
  id: string;
  title: string;
  originalTitle: string;
  synopsis: string;
  director: string;
  durationMinutes: number;
  posterUrl: string;
  bannerUrl: string;
  trailerUrl: string;
  releaseDate: string;
  publicRating: number;
  rating: {
    code: string;
    description: string;
  };
  genres: Array<{
    id: number;
    name: string;
  }>;
  cast: Array<{
    actorName: string;
    roleName: string;
  }>;
}
