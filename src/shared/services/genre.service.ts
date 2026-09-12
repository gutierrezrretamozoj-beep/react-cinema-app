import api from "@/shared/api/client";
import type { Genre } from "@/shared/interfaces/genre";
import type { ApiWrapper } from "@/shared/interfaces/apiWrapper";

/**
 * Service responsible for fetching genres.
 */
export class GenreService {
  /**
   * Retrieves all available genres.
   * @returns Promise resolving to an array of genres
   */
  async getAll(): Promise<Genre[]> {
    const { data } = await api.get<ApiWrapper<Genre[]> | Genre[]>("/genres");
    if (Array.isArray(data)) return data;
    return data.data;
  }
}

export const genreService = new GenreService();
