import type { LoginCredentials, LoginResponse, RegistrationData, RegistrationResponse, User } from "../interfaces";

const MOCK_USERS: Array<User & { password: string }> = [
  { id: "1", name: "Milton Escamilla", email: "milton@cine.com", password: "123456" },
  { id: "2", name: "Admin", email: "admin@cine.com", password: "admin123" },
];

const SIMULATED_DELAY_MS = 800;

/**
 * Authenticates a user against the mock user list.
 *
 * @remarks
 * There is no backend or state library (Zustand/Context) installed yet, so this
 * folder only exposes simple functions. When the backend is ready, `signIn` will
 * be replaced by a real fetch call and this folder can evolve into a real store
 * without touching the UI, because the signature (receives credentials, returns
 * a `LoginResponse`) does not change.
 *
 * @param credentials - The user email and password.
 * @returns A promise that resolves once authentication is checked.
 */
export function signIn(credentials: LoginCredentials): Promise<LoginResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const foundUser = MOCK_USERS.find(
        (user) => user.email.toLowerCase() === credentials.email.toLowerCase()
      );

      if (!foundUser) {
        resolve({ success: false, message: "No existe una cuenta con ese correo." });
        return;
      }

      if (foundUser.password !== credentials.password) {
        resolve({ success: false, message: "La contraseña es incorrecta." });
        return;
      }

      const safeUser: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
      };

      localStorage.setItem("token_cine", `token-${foundUser.id}`);
      localStorage.setItem("usuario_cine", JSON.stringify(safeUser));

      resolve({ success: true, user: safeUser });
    }, SIMULATED_DELAY_MS);
  });
}

/**
 * Registers a new user in the mock user list and starts a session.
 *
 * @param data - The name, email and password for the new account.
 * @returns A promise that resolves after the account is created or rejected.
 */
export function registerUser(data: RegistrationData): Promise<RegistrationResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const emailExists = MOCK_USERS.some(
        (user) => user.email.toLowerCase() === data.email.toLowerCase()
      );

      if (emailExists) {
        resolve({ success: false, message: "Ya existe una cuenta con ese correo." });
        return;
      }

      const newUser: User = {
        id: String(Date.now()),
        name: data.name,
        email: data.email,
      };

      MOCK_USERS.push({ ...newUser, password: data.password });

      localStorage.setItem("token_cine", `token-${newUser.id}`);
      localStorage.setItem("usuario_cine", JSON.stringify(newUser));

      resolve({ success: true, user: newUser });
    }, SIMULATED_DELAY_MS);
  });
}

/**
 * Ends the current session by clearing the local storage credentials.
 */
export function signOut(): void {
  localStorage.removeItem("token_cine");
  localStorage.removeItem("usuario_cine");
}

/**
 * Returns the currently stored user, or null if there is none.
 *
 * @returns The stored `User` object or `null`.
 */
export function getCurrentUser(): User | null {
  const savedUser = localStorage.getItem("usuario_cine");
  return savedUser ? JSON.parse(savedUser) : null;
}

/**
 * Checks whether there is an active session.
 *
 * @returns `true` if a session token exists, `false` otherwise.
 */
export function isAuthenticated(): boolean {
  return localStorage.getItem("token_cine") !== null;
}