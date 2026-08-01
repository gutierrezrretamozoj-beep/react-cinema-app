import { useState, type FormEvent } from "react";
import { iniciarSesion } from "../store";

interface LoginFormProps {
  onLoginExitoso?: () => void;
}

export const LoginForm = ({ onLoginExitoso }: LoginFormProps) => {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function manejarEnvio(evento: FormEvent) {
    evento.preventDefault();
    setError(null);
    setCargando(true);

    const respuesta = await iniciarSesion({ correo, contraseña });

    setCargando(false);

    if (!respuesta.exito) {
      setError(respuesta.mensaje ?? "Ocurrió un error al iniciar sesión.");
      return;
    }

    onLoginExitoso?.();
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

      <form className="flex flex-col gap-4" onSubmit={manejarEnvio} noValidate>
        <label className="flex flex-col gap-1.5 text-xs text-neutral-300">
          <span>Correo</span>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
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
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
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
          disabled={cargando}
          className="mt-1 rounded-lg bg-yellow-500 py-3 text-sm font-bold tracking-wide text-neutral-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {cargando ? "Validando..." : "Entrar a la sala"}
        </button>
      </form>

      <p className="mt-4 text-center text-[11px] text-neutral-500">
        Usuario de prueba: milton@cine.com / 123456
      </p>
    </div>
  );
};