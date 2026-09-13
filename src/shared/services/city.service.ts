import api from "@/shared/api/client";
import type { City } from "@/shared/interfaces/city";
import type { ApiWrapper } from "@/shared/interfaces/apiWrapper";

/**
 * Service responsible for fetching cities filtered by department.
 */
export class CityService {
  /**
   * Retrieves cities belonging to a specific department.
   * @param departmentId - Identifier of the department
   * @returns Promise resolving to an array of cities
   */
  async getByDepartmentId(departmentId: number): Promise<City[]> {
    const { data } = await api.get<ApiWrapper<City[]> | City[]>("/cities", {
      params: { departmentId },
    });

    if (Array.isArray(data)) return data;
    return data.data;
  }
}

export const cityService = new CityService();
