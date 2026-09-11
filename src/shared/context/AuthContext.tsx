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
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('cinema_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email: string, _password: string): boolean => {
    const name = email.split('@')[0];
    const newUser = {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email,
      avatar: name.charAt(0).toUpperCase(),
    };
    setUser(newUser);
    localStorage.setItem('cinema_user', JSON.stringify(newUser));
    return true;
  };

  const register = (name: string, email: string, _password: string): boolean => {
    const newUser = {
      name,
      email,
      avatar: name.charAt(0).toUpperCase(),
    };
    setUser(newUser);
    localStorage.setItem('cinema_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cinema_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
