import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";

/**
 * Resolved API base URL from environment variables.
 */
export const API_BASE_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ?? "http://localhost:3000";

/**
 * Local storage key for JWT authentication token.
 */
export const TOKEN_STORAGE_KEY = "token_cine";

/**
 * HTTP client wrapper around Axios with JWT injection and centralized configuration.
 */
export class ApiClient {
  private readonly instance: AxiosInstance;

  /**
   * @param baseURL - Base URL for all API requests
   */
  constructor(baseURL: string = API_BASE_URL) {
    this.instance = axios.create({
      baseURL,
      headers: { "Content-Type": "application/json" },
      timeout: 15000,
    });

    this.instance.interceptors.request.use(this.attachAuthHeader);
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error?.response?.status === 401) {
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          localStorage.removeItem("usuario_cine");
          localStorage.removeItem("cinema_user");
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Attaches Bearer token from localStorage to every outgoing request when available.
   * @param config - Axios internal request configuration
   * @returns Modified request configuration with Authorization header
   */
  private attachAuthHeader(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }

  /**
   * Retrieves the underlying Axios instance for advanced usage.
   * @returns Axios instance
   */
  getAxiosInstance(): AxiosInstance {
    return this.instance;
  }

  /**
   * Persists JWT token in localStorage.
   * @param token - JWT string received from backend
   */
  setToken(token: string): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }

  /**
   * Removes JWT token from localStorage.
   */
  clearToken(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }

  /**
   * Retrieves current JWT token from localStorage.
   * @returns JWT token or null
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }
}

export const apiClient = new ApiClient();
export const api = apiClient.getAxiosInstance();
export default api;
