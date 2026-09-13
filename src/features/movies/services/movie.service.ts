import api from "@/shared/api/client";
import type { MovieListItem, MovieDetail } from "@/shared/interfaces/movie";
import type { Showtime } from "@/shared/interfaces/showtime";
import type { ApiWrapper } from "@/shared/interfaces/apiWrapper";

/**
 * Service responsible for movie catalog and showtime operations.
 */
export class MovieService {
  /**
   * Retrieves the full movie catalog.
   * @returns Promise resolving to an array of movie summaries
   */
  async getAll(): Promise<MovieListItem[]> {
    const { data } = await api.get<ApiWrapper<MovieListItem[]> | MovieListItem[]>("/movies");
    if (Array.isArray(data)) return data;
    return data.data;
  }

  /**
   * Retrieves detailed information for a single movie.
   * @param id - Identifier of the movie
   * @returns Promise resolving to detailed movie data
   */
  async getById(id: string): Promise<MovieDetail> {
    const { data } = await api.get<ApiWrapper<MovieDetail> | MovieDetail>(`/movies/${id}`);
    if (data && typeof data === "object" && "success" in data) {
      return (data as ApiWrapper<MovieDetail>).data;
    }
    return data as MovieDetail;
  }

  /**
   * Retrieves all showtimes for a given movie.
   * @param movieId - Identifier of the movie
   * @returns Promise resolving to an array of showtimes
   */
  async getShowtimes(movieId: string): Promise<Showtime[]> {
    const { data } = await api.get<ApiWrapper<Showtime[]> | Showtime[]>(`/movies/${movieId}/showtimes`);
    if (Array.isArray(data)) return data;
    return data.data;
  }
}

export const movieService = new MovieService();
