import api from "@/shared/api/client";
import type { CreateUserPayload } from "@/shared/interfaces/user";

/**
 * Service responsible for user management.
 */
export class UserService {
  /**
   * Creates a new user account.
   * @param payload - User registration data
   * @returns Promise resolving when the user is created
   */
  async create(payload: CreateUserPayload): Promise<void> {
    await api.post("/users", payload);
  }
}

export const userService = new UserService();
