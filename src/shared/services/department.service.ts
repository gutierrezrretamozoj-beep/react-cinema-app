import api from "@/shared/api/client";
import type { Department } from "@/shared/interfaces/department";

/**
 * Service responsible for fetching departments filtered by country.
 */
export class DepartmentService {
  /**
   * Retrieves departments belonging to a specific country.
   * @param countryId - Identifier of the country
   * @returns Promise resolving to an array of departments
   */
  async getByCountryId(countryId: number): Promise<Department[]> {
    const { data } = await api.get<Department[]>("/departments", {
      params: { countryId },
    });
    return data;
  }
}

export const departmentService = new DepartmentService();
