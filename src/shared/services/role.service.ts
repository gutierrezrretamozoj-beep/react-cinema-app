import api from "@/shared/api/client";
import type { Role } from "@/shared/interfaces/role";
import type { ApiWrapper } from "@/shared/interfaces/apiWrapper";

/**
 * Service responsible for fetching roles.
 */
export class RoleService {
  /**
   * Retrieves all available roles.
   * @returns Promise resolving to an array of roles
   */
  async getAll(): Promise<Role[]> {
    const { data } = await api.get<ApiWrapper<Role[]> | Role[]>("/roles");
    if (Array.isArray(data)) return data;
    return data.data;
  }
}

export const roleService = new RoleService();
