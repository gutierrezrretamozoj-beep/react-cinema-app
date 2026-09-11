// AuthContext.tsx — Contexto de autenticación para simular inicio de sesión y registro
// Reutiliza y adapta el flujo de la referencia.

import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface User {
  name: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  authenticate: (user: Omit<User, 'avatar'>) => void;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('cinema_user') ?? localStorage.getItem('usuario_cine');
    if (!saved) return null;

    const storedUser = JSON.parse(saved) as Omit<User, 'avatar'> & { avatar?: string };
    return {
      ...storedUser,
      avatar: storedUser.avatar ?? storedUser.name.charAt(0).toUpperCase(),
    };
  });

  const authenticate = (authenticatedUser: Omit<User, 'avatar'>) => {
    const nextUser = {
      ...authenticatedUser,
      avatar: authenticatedUser.name.charAt(0).toUpperCase(),
    };
    setUser(nextUser);
    localStorage.setItem('cinema_user', JSON.stringify(nextUser));
  };

  const login = (email: string, _password: string): boolean => {
    const name = email.split('@')[0];
    authenticate({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email,
    });
    return true;
  };

  const register = (name: string, email: string, _password: string): boolean => {
    authenticate({ name, email });
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cinema_user');
    localStorage.removeItem('usuario_cine');
    localStorage.removeItem('token_cine');
  };

  return (
    <AuthContext.Provider value={{ user, authenticate, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
