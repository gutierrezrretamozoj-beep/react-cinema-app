/**
 * Credentials required to authenticate a user.
 */
export interface LoginPayload {
  email: string;
  password: string;
}

/**
 * User returned by the authentication endpoint.
 */
export interface AuthUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

/**
 * Successful authentication response from POST /auth/login.
 */
export interface LoginApiResponse {
  message: string;
  token: string;
  user: AuthUser;
}
