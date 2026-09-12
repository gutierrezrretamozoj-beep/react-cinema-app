export interface User {
  id: string;
  name: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
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
  email: string;
  password: string;
  documentTypeId: number;
  documentNumber: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  phone: string;
  address: string;
  cityId: number;
}

export interface RegistrationResponse {
  success: boolean;
  user?: User;
  message?: string;
}