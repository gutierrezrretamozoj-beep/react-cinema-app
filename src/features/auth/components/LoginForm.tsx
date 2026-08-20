import { useState } from "react";
import { signIn } from "../store";

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

/**
 * Login form that authenticates the user against the mock store.
 *
 * @param props - Component props.
 * @param props.onLoginSuccess - Optional callback invoked after a successful login.
 */
export const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles form submission and calls the sign-in action.
   *
   * @param event - The form submit event.
   */
  async function handleSubmit(event: React.SubmitEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const response = await signIn({ email, password });

    setLoading(false);

    if (!response.success) {
      setError(response.message ?? "Ocurrió un error al iniciar sesión.");
      return;
    }

    onLoginSuccess?.();
  }

  return (
    <div className="relative w-full max-w-sm rounded-2xl border border-yellow-900/40 bg-neutral-900 p-9 pt-9 pb-7 text-neutral-100 shadow-2xl">
      <span className="absolute top-1/2 -left-3 h-6 w-6 -translate-y-1/2 rounded-full bg-neutral-950" />
      <span className="absolute top-1/2 -right-3 h-6 w-6 -translate-y-1/2 rounded-full bg-neutral-950" />

      <div className="mb-5 text-center">
        <span className="text-[11px] font-semibold tracking-[3px] text-yellow-500">
          ADMIT ONE
        </span>
        <h1 className="mt-1 text-3xl font-extrabold tracking-wide">CineApp</h1>
        <p className="text-sm text-neutral-400">Tu función empieza aquí</p>
      </div>

      <div className="-mx-9 mb-6 border-t border-dashed border-yellow-900/40" />

      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <label className="flex flex-col gap-1.5 text-xs text-neutral-300">
          <span>Correo</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            autoComplete="email"
            required
            className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-neutral-100 outline-none focus:border-yellow-500"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-xs text-neutral-300">
          <span>Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
            className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-neutral-100 outline-none focus:border-yellow-500"
          />
        </label>

        {error && (
          <p role="alert" className="rounded-md border border-red-500/25 bg-red-500/10 px-2.5 py-2 text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-1 rounded-lg bg-yellow-500 py-3 text-sm font-bold tracking-wide text-neutral-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Validando..." : "Entrar a la sala"}
        </button>
      </form>

      <p className="mt-4 text-center text-[11px] text-neutral-500">
        ¿No tienes cuenta?{" "}
        <a href="/auth/register" className="text-yellow-500 hover:underline">Regístrate</a>
      </p>

      <p className="mt-2 text-center text-[11px] text-neutral-500">
        Usuario de prueba: milton@cine.com / 123456
      </p>
    </div>
  );
};