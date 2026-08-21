export interface User {
  id: string;
  name: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  message?: string;
}

export interface RegistrationData {
  name: string;
  email: string;
  password: string;
  country: string;
  department: string;
  city: string;
}

export interface RegistrationResponse {
  success: boolean;
  user?: User;
  message?: string;
}