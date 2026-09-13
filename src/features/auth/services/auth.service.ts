import api from "@/shared/api/client";
import type { LoginPayload, LoginApiResponse } from "@/shared/interfaces/auth";

/**
 * Service responsible for authentication operations.
 */
export class AuthService {
  /**
   * Authenticates a user with email and password.
   * @param payload - Login credentials containing email and password
   * @returns Promise resolving to token, message and user data
   */
  async login(payload: LoginPayload): Promise<LoginApiResponse> {
    const { data } = await api.post<LoginApiResponse>("/auth/login", payload);
    return data;
  }
}

export const authService = new AuthService();
