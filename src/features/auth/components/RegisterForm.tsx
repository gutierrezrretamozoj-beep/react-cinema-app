import { useState } from "react";
import { useNavigate } from "react-router";
import { registerUser } from "../store";

interface RegisterFormProps {
  onRegisterSuccess?: () => void;
}

export const RegisterForm = ({
  onRegisterSuccess,
}: RegisterFormProps) => {
  const navigate = useNavigate();

  // Estados del formulario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Registrar usuario
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError(null);

    const response = await registerUser({
      name,
      email,
      password,
    });

    setLoading(false);

    if (!response.success) {
      setError(response.message ?? "Ocurrió un error al crear la cuenta.");
      return;
    }

    onRegisterSuccess?.();

    navigate("/auth/login");
  }

  return (
    <div className="w-full max-w-md rounded-2xl bg-gradient-to-br from-black/75 via-neutral-950/70 to-black/60 p-10 text-neutral-100 shadow-[0_0_100px_rgba(0,0,0,.55)] backdrop-blur-2xl">

      {/* Encabezado */}

      <div className="mb-6 text-center">

        <span className="text-xs font-semibold tracking-widest text-yellow-500">
          NEW TICKET
        </span>

        <h1 className="mt-2 text-4xl font-extrabold">
          CineApp
        </h1>

        <p className="mt-2 text-sm text-neutral-400">
          Crea tu cuenta y disfruta la experiencia
        </p>

      </div>

      {/* Línea del boleto */}

      <div className="-mx-10 mb-8 border-t border-dashed border-yellow-900/40" />

      {/* Formulario */}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5"
        noValidate
      >

        <label className="flex flex-col gap-2">

          <span className="text-sm text-neutral-300">
            Nombre
          </span>

          <input
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            className="rounded-lg border border-neutral-700 bg-black px-4 py-3 text-sm outline-none transition-colors focus:border-yellow-500"
          />

        </label>

        <label className="flex flex-col gap-2">

          <span className="text-sm text-neutral-300">
            Correo
          </span>

          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@cine.com"
            className="rounded-lg border border-neutral-700 bg-black px-4 py-3 text-sm outline-none transition-colors focus:border-yellow-500"
          />

        </label>

        <label className="flex flex-col gap-2">

          <span className="text-sm text-neutral-300">
            Contraseña
          </span>

          <input
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="rounded-lg border border-neutral-700 bg-black px-4 py-3 text-sm outline-none transition-colors focus:border-yellow-500"
          />

        </label>

        {/* Error */}

        {error && (
          <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </p>
        )}

        {/* Botón */}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-lg bg-yellow-500 py-3.5 text-sm font-bold tracking-wide text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>

      </form>

      {/* Ir al login */}

      <p className="mt-6 text-center text-xs text-neutral-400">

        ¿Ya tienes cuenta?{" "}

        <a
          href="/auth/login"
          className="text-yellow-500 hover:underline"
        >
          Inicia sesión
        </a>

      </p>

    </div>
  );
};