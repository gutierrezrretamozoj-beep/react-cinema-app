import { authService } from "../services/auth.service";
import { userService } from "../services/user.service";
import { apiClient, TOKEN_STORAGE_KEY } from "@/shared/api/client";
import type { LoginCredentials, LoginResponse, RegistrationData, RegistrationResponse, User } from "../interfaces";
import { AxiosError } from "axios";

/**
 * Maps backend AuthUser to local User model.
 * @param raw - Backend user with first_name/last_name
 * @returns Normalized User
 */
function mapAuthUser(raw: { id: number | string; first_name: string; last_name: string; email: string; role?: string }): User {
  return {
    id: String(raw.id),
    name: `${raw.first_name} ${raw.last_name}`.trim(),
    email: raw.email,
    firstName: raw.first_name,
    lastName: raw.last_name,
    role: raw.role,
  };
}

/**
 * Persists user and token in localStorage.
 * @param user - Normalized user
 * @param token - JWT token
 */
function persistSession(user: User, token: string): void {
  apiClient.setToken(token);
  localStorage.setItem("usuario_cine", JSON.stringify(user));
  localStorage.setItem("cinema_user", JSON.stringify({ ...user, avatar: user.name.charAt(0).toUpperCase() }));
}

/**
 * Extracts error message from Axios or API response.
 * @param error - Caught error
 * @returns Human readable message
 */
function extractMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: string; error?: string } | undefined;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
    if (error.message) return error.message;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

/**
 * Authenticates a user against the real backend.
 * @param credentials - Email and password
 * @returns Login response with user or error message
 */
export async function signIn(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const data = await authService.login(credentials);
    const mapped = mapAuthUser(data.user);
    persistSession(mapped, data.token);
    return { success: true, user: mapped, message: data.message };
  } catch (error) {
    return { success: false, message: extractMessage(error, "No se pudo iniciar sesión. Verifica tus credenciales.") };
  }
}

/**
 * Registers a new user via POST /users and auto-logs in when backend returns token.
 * @param data - Registration payload with normalized fields
 * @returns Registration response
 */
export async function registerUser(data: RegistrationData): Promise<RegistrationResponse> {
  try {
    await userService.create({
      email: data.email,
      password: data.password,
      document_type_id: data.documentTypeId,
      document_number: data.documentNumber,
      first_name: data.firstName,
      last_name: data.lastName,
      birth_date: data.birthDate,
      gender: data.gender,
      phone: data.phone,
      address: data.address,
      city_id: data.cityId,
    });

    try {
      const loginRes = await authService.login({ email: data.email, password: data.password });
      const mapped = mapAuthUser(loginRes.user);
      persistSession(mapped, loginRes.token);
      return { success: true, user: mapped, message: "Cuenta creada correctamente." };
    } catch {
      return { success: true, message: "Cuenta creada. Ahora puedes iniciar sesión." };
    }
  } catch (error) {
    return { success: false, message: extractMessage(error, "No se pudo crear la cuenta.") };
  }
}

/**
 * Ends the current session by clearing token and user data.
 */
export function signOut(): void {
  apiClient.clearToken();
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem("usuario_cine");
  localStorage.removeItem("cinema_user");
}

/**
 * Returns the currently stored user, or null if there is none.
 * @returns Stored User or null
 */
export function getCurrentUser(): User | null {
  const savedUser = localStorage.getItem("usuario_cine") ?? localStorage.getItem("cinema_user");
  return savedUser ? (JSON.parse(savedUser) as User) : null;
}

/**
 * Checks whether there is an active session.
 * @returns True if a session token exists
 */
export function isAuthenticated(): boolean {
  return localStorage.getItem(TOKEN_STORAGE_KEY) !== null;
}
