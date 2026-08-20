import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { registerUser } from "../store";
import { Link } from "react-router";

interface RegisterFormProps {
  onRegisterSuccess?: () => void;
}

/**
 * Registration form that creates a new account through the mock store.
 *
 * @param props - Component props.
 * @param props.onRegisterSuccess - Optional callback invoked after a successful registration.
 */
export const RegisterForm = ({ onRegisterSuccess }: RegisterFormProps) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<"name" | "email" | "password" | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  /**
   * Handles form submission and calls the registration action.
   *
   * @param event - The form submit event.
   */
  async function handleSubmit(event: React.SubmitEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const response = await registerUser({ name, email, password });

    setLoading(false);

    if (!response.success) {
      setError(response.message ?? "Ocurrió un error al crear tu cuenta.");
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }

    setSuccess(true);
    onRegisterSuccess?.();
    setTimeout(() => navigate("/auth/login"), 1500);
  }

  return (
    <div
      className={`relative w-full overflow-visible rounded-3xl p-6 ${shake ? "animate-shake" : ""}`}
      style={{
        background: "linear-gradient(135deg, rgba(20,20,35,0.95) 0%, rgba(10,10,20,0.98) 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: success
          ? "0 0 0 2px rgba(234,179,8,0.5), 0 30px 80px -20px rgba(0,0,0,0.9), 0 0 60px rgba(234,179,8,0.1)"
          : "0 30px 80px -20px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.04)",
        transition: "box-shadow 0.4s ease",
      }}
    >
      {/* Header del formulario */}
      <div className="mb-5 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="h-px flex-1 bg-linear-to-r from-transparent to-yellow-500/20" />
          <span className="text-[10px] font-bold tracking-[4px] text-yellow-500/60 uppercase px-2">Nuevo Boleto</span>
          <div className="h-px flex-1 bg-linear-to-l from-transparent to-yellow-500/20" />
        </div>
        <h2 className="text-2xl font-black text-white mb-1">Crea tu cuenta</h2>
        <p className="text-sm text-neutral-500">Únete a la función</p>
      </div>

      {/* Divisor de ticket */}
      <div className="relative -mx-6 mb-5">
        <div className="border-t border-dashed border-white/6" />
        <div className="absolute left-0 -top-2 w-4 h-4 rounded-full" style={{ background: "#050810" }} />
        <div className="absolute right-0 -top-2 w-4 h-4 rounded-full" style={{ background: "#050810" }} />
      </div>

      {/* Estado de éxito */}
      {success && (
        <div
          className="mb-6 flex flex-col items-center gap-2 rounded-2xl py-5"
          style={{ background: "rgba(234,179,8,0.05)", border: "1px solid rgba(234,179,8,0.15)" }}
        >
          <div className="text-3xl animate-bounce">🎬</div>
          <p className="text-sm font-bold text-yellow-400">¡Cuenta creada con éxito!</p>
          <p className="text-xs text-neutral-500">Redirigiendo al login...</p>
        </div>
      )}

      {/* Formulario */}
      {!success && (
        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          {/* Nombre */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Nombre completo
            </label>
            <div
              className="relative overflow-hidden rounded-xl transition-all duration-300"
              style={{
                background: focusedField === "name" ? "rgba(234,179,8,0.04)" : "rgba(255,255,255,0.03)",
                border: focusedField === "name"
                  ? "1px solid rgba(234,179,8,0.35)"
                  : "1px solid rgba(255,255,255,0.07)",
                boxShadow: focusedField === "name" ? "0 0 0 3px rgba(234,179,8,0.06)" : "none",
              }}
            >
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-600 transition-colors duration-200"
                style={{ color: focusedField === "name" ? "rgba(234,179,8,0.6)" : undefined }}>
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.8">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <input
                ref={nameRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                placeholder="Tu nombre"
                autoComplete="name"
                required
                className="w-full bg-transparent pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-600 outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Correo electrónico
            </label>
            <div
              className="relative overflow-hidden rounded-xl transition-all duration-300"
              style={{
                background: focusedField === "email" ? "rgba(234,179,8,0.04)" : "rgba(255,255,255,0.03)",
                border: focusedField === "email"
                  ? "1px solid rgba(234,179,8,0.35)"
                  : "1px solid rgba(255,255,255,0.07)",
                boxShadow: focusedField === "email" ? "0 0 0 3px rgba(234,179,8,0.06)" : "none",
              }}
            >
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-600 transition-colors duration-200"
                style={{ color: focusedField === "email" ? "rgba(234,179,8,0.6)" : undefined }}>
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.8">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                placeholder="tu@correo.com"
                autoComplete="email"
                required
                className="w-full bg-transparent pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-600 outline-none"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Contraseña
            </label>
            <div
              className="relative overflow-hidden rounded-xl transition-all duration-300"
              style={{
                background: focusedField === "password" ? "rgba(234,179,8,0.04)" : "rgba(255,255,255,0.03)",
                border: focusedField === "password"
                  ? "1px solid rgba(234,179,8,0.35)"
                  : "1px solid rgba(255,255,255,0.07)",
                boxShadow: focusedField === "password" ? "0 0 0 3px rgba(234,179,8,0.06)" : "none",
              }}
            >
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200"
                style={{ color: focusedField === "password" ? "rgba(234,179,8,0.6)" : "rgba(100,100,100,1)" }}>
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                placeholder="••••••••"
                autoComplete="new-password"
                required
                className="w-full bg-transparent pl-10 pr-12 py-2.5 text-sm text-white placeholder-neutral-600 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-600 transition-colors hover:text-neutral-400 focus:outline-none"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
                  {showPassword ? (
                    <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411M3 3l18 18" strokeLinecap="round" strokeLinejoin="round" />
                  ) : (
                    <><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round" /></>
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              className="flex items-start gap-2.5 rounded-xl px-3.5 py-3"
              style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)" }}
              role="alert"
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 mt-0.5 shrink-0 text-red-400" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-sm text-red-400 leading-relaxed">{error}</p>
            </div>
          )}

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={loading || !name || !email || !password}
            className="relative mt-2 w-full overflow-hidden rounded-xl py-3 text-sm font-bold tracking-widest uppercase transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500/40 disabled:cursor-not-allowed"
            style={{
              background: loading || !name || !email || !password
                ? "rgba(255,255,255,0.05)"
                : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              color: loading || !name || !email || !password ? "rgba(255,255,255,0.2)" : "#0a0a0a",
              boxShadow: !loading && name && email && password
                ? "0 8px 30px rgba(234,179,8,0.25), 0 1px 0 rgba(255,255,255,0.1) inset"
                : "none",
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creando cuenta...
              </span>
            ) : (
              "Crear cuenta 🎬"
            )}
          </button>
        </form>
      )}

      {/* Footer */}
      <div className="relative mt-4">
        <div className="border-t border-dashed border-white/5 -mx-6 mb-4">
          <div className="absolute left-0 -top-2 w-4 h-4 rounded-full" style={{ background: "#050810" }} />
          <div className="absolute right-0 -top-2 w-4 h-4 rounded-full" style={{ background: "#050810" }} />
        </div>
        <p className="text-center text-[11px] text-neutral-600">
          ¿Ya tienes cuenta?{" "}
          <Link to="/auth/login" className="text-yellow-500 hover:text-yellow-400 transition-colors font-semibold">
            Inicia sesión
          </Link>
        </p>
      </div>

      <style>{`\n@keyframes shake {
      \n 0%, 100% { transform: translateX(0); }
      \n 15% { transform: translateX(-8px); }
      \n 30% { transform: translateX(8px); }
      \n 45% { transform: translateX(-6px); }
      \n 60% { transform: translateX(6px); }
      \n 75% { transform: translateX(-3px); }
      \n 90% { transform: translateX(3px); }
      \n}
      \n .animate-shake { animation: shake 0.6s ease; }
      \n `}</style>
    </div>
  );
};