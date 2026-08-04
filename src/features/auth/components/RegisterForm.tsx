import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { registrarUsuario } from "../store";

interface RegisterFormProps {
  onRegisterSuccess?: () => void;
}

export const RegisterForm = ({ onRegisterSuccess }: RegisterFormProps) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const response = await registrarUsuario({ nombre: name, correo: email, contraseña: password });

    setLoading(false);

    if (!response.exito) {
      setError(response.mensaje ?? "Ocurrió un error al crear tu cuenta.");
      return;
    }

    onRegisterSuccess?.();
    navigate("/auth/login");
  }

  return (
    <div className="relative w-full max-w-sm rounded-2xl border border-yellow-900/40 bg-neutral-900 p-9 pt-9 pb-7 text-neutral-100 shadow-2xl">
      <span className="absolute top-1/2 -left-3 h-6 w-6 -translate-y-1/2 rounded-full bg-neutral-950" />
      <span className="absolute top-1/2 -right-3 h-6 w-6 -translate-y-1/2 rounded-full bg-neutral-950" />

      <div className="mb-5 text-center">
        <span className="text-[11px] font-semibold tracking-[3px] text-yellow-500">
          NUEVO BOLETO
        </span>
        <h1 className="mt-1 text-3xl font-extrabold tracking-wide">CineApp</h1>
        <p className="text-sm text-neutral-400">Crea tu cuenta y únete a la función</p>
      </div>

      <div className="-mx-9 mb-6 border-t border-dashed border-yellow-900/40" />

      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <label className="flex flex-col gap-1.5 text-xs text-neutral-300">
          <span>Nombre</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            autoComplete="name"
            required
            className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-neutral-100 outline-none focus:border-yellow-500"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-xs text-neutral-300">
          <span>Gmail</span>
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
            autoComplete="new-password"
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
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>

      <p className="mt-4 text-center text-[11px] text-neutral-500">
        ¿Ya tienes cuenta?{" "}
        <a href="/auth/login" className="text-yellow-500 hover:underline">Inicia sesión</a>
      </p>
    </div>
  );
};