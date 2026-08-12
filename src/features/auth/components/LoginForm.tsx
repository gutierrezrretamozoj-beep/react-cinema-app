import { useState } from "react";
import { signIn } from "../store";

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

export const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  // Guarda el correo escrito por el usuario.
  const [email, setEmail] = useState("");

  // Guarda la contraseña escrita por el usuario.
  const [password, setPassword] = useState("");

  // Indica si se está validando el login.
  const [loading, setLoading] = useState(false);

  // Guarda el mensaje de error.
  const [error, setError] = useState<string | null>(null);

  // Envía los datos para iniciar sesión.
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setLoading(true);

    const response = await signIn({
      email,
      password,
    });

    setLoading(false);

    // Si hay un error, lo mostramos.
    if (!response.success) {
      setError(
        response.message ?? "Ocurrió un error al iniciar sesión."
      );
      return;
    }

    // Si todo salió bien, avisamos al componente padre.
    onLoginSuccess?.();
  }

  return (
    <div className="relative w-full max-w-md rounded-3xl border border-yellow-900/50 bg-neutral-900 px-8 py-9 text-neutral-100 shadow-2xl sm:px-10 sm:py-10">

      {/* Agujero izquierdo del boleto */}
      <span className="absolute left-0 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black" />

      {/* Agujero derecho del boleto */}
      <span className="absolute right-0 top-1/2 h-7 w-7 translate-x-1/2 -translate-y-1/2 rounded-full bg-black" />

      {/* Encabezado */}
      <div className="mb-7 text-center">

        <span className="text-xs font-semibold uppercase tracking-widest text-yellow-500">
          ADMIT ONE
        </span>

        <h1 className="mt-2 text-4xl font-black tracking-wide sm:text-5xl">
          CineApp
        </h1>

        <p className="mt-2 text-sm text-neutral-400 sm:text-base">
          Tu función empieza aquí
        </p>

      </div>

      {/* Línea de separación */}
      <div className="-mx-8 mb-7 border-t border-dashed border-yellow-900/50 sm:-mx-10" />

            {/* Formulario */}
      <form
        className="flex flex-col gap-5"
        onSubmit={handleSubmit}
        noValidate
      >

        {/* Campo de correo */}
        <label className="flex flex-col gap-2 text-sm text-neutral-300">

          <span>Correo</span>

          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="tu@correo.com"
            autoComplete="email"
            required
            className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-neutral-100 outline-none transition focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
          />

        </label>

        {/* Campo de contraseña */}
        <label className="flex flex-col gap-2 text-sm text-neutral-300">

          <span>Contraseña</span>

          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
            className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-neutral-100 outline-none transition focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
          />

        </label>

        {/* Mensaje de error */}
        {error && (
          <p
            role="alert"
            className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400"
          >
            {error}
          </p>
        )}

        {/* Botón de inicio de sesión */}
        <button
          type="submit"
          disabled={loading}
          className="mt-1 w-full rounded-xl bg-yellow-500 py-3.5 text-sm font-bold tracking-wide text-neutral-950 transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Validando..." : "Entrar a la sala"}
        </button>

      </form>

            {/* Enlace para registrarse */}
      <p className="mt-5 text-center text-xs text-neutral-500">
        ¿No tienes cuenta?{" "}
        <a
          href="/auth/register"
          className="font-semibold text-yellow-500 hover:text-yellow-400 hover:underline"
        >
          Regístrate
        </a>
      </p>

      {/* Usuario de prueba */}
      <p className="mt-3 text-center text-xs text-neutral-600">
        Usuario de prueba: milton@cine.com / 123456
      </p>

    </div>
  );
};