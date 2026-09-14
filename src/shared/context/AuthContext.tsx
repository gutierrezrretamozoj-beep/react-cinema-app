import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { apiClient, TOKEN_STORAGE_KEY } from "@/shared/api/client";

/**
 * User model used across the application.
 */
export interface User {
  id?: string;
  name: string;
  email: string;
  avatar: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

/**
 * Shape exposed by the authentication context.
 */
interface AuthContextType {
  user: User | null;
  authenticate: (user: Omit<User, "avatar"> & { avatar?: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Builds a User with avatar fallback from any stored shape.
 * @param raw - Raw user object from localStorage
 * @returns Normalized user with avatar
 */
function normalizeStoredUser(raw: Record<string, unknown>): User {
  const name = (raw.name as string) ?? `${(raw.first_name as string) ?? ""} ${(raw.last_name as string) ?? ""}`.trim() ?? (raw.email as string);
  return {
    id: raw.id as string | undefined,
    name,
    email: raw.email as string,
    avatar: (raw.avatar as string) ?? name.charAt(0).toUpperCase(),
    firstName: (raw.firstName as string) ?? (raw.first_name as string),
    lastName: (raw.lastName as string) ?? (raw.last_name as string),
    role: raw.role as string | undefined,
  };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("cinema_user") ?? localStorage.getItem("usuario_cine");
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved) as Record<string, unknown>;
      return normalizeStoredUser(parsed);
    } catch {
      return null;
    }
  });

  /**
   * Persists an authenticated user and updates context state.
   * @param authenticatedUser - User data without avatar
   */
  const authenticate = (authenticatedUser: Omit<User, "avatar"> & { avatar?: string }) => {
    const nextUser: User = {
      ...authenticatedUser,
      avatar: authenticatedUser.avatar ?? authenticatedUser.name.charAt(0).toUpperCase(),
    };
    setUser(nextUser);
    localStorage.setItem("cinema_user", JSON.stringify(nextUser));
    localStorage.setItem("usuario_cine", JSON.stringify(nextUser));
  };

  /**
   * Clears session, token and stored user.
   */
  const logout = () => {
    setUser(null);
    apiClient.clearToken();
    localStorage.removeItem("cinema_user");
    localStorage.removeItem("usuario_cine");
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  };

  return <AuthContext.Provider value={{ user, authenticate, logout }}>{children}</AuthContext.Provider>;
};

/**
 * Hook to access authentication context.
 * @returns Auth context value
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
