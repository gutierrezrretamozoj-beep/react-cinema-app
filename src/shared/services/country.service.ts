import api from "@/shared/api/client";
import type { Country } from "@/shared/interfaces/country";

/**
 * Service responsible for fetching countries.
 */
export class CountryService {
  /**
   * Retrieves all available countries.
   * @returns Promise resolving to an array of countries
   */
  async getAll(): Promise<Country[]> {
    const { data } = await api.get<Country[]>("/countries");
    return data;
  }
}

export const countryService = new CountryService();
