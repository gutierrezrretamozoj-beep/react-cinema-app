import { useState, useEffect, useRef } from "react";
import { signIn } from "../../store";
import { Link, useNavigate } from "react-router";

// ─── Partícula flotante ───────────────────────────────────────────────────────
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  delay: number;
}

const generateParticles = (count: number): Particle[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    speed: Math.random() * 25 + 15,
    opacity: Math.random() * 0.4 + 0.1,
    delay: Math.random() * 10,
  }));

// ─── Componente principal ─────────────────────────────────────────────────────
export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<"email" | "password" | null>(null);
  const [particles] = useState(() => generateParticles(35));
  const [mounted, setMounted] = useState(false);
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    emailRef.current?.focus();
    return () => clearTimeout(t);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);

    const response = await signIn({ email, password });
    setLoading(false);

    if (!response.success) {
      setError(response.message ?? "Credenciales incorrectas. Inténtalo de nuevo.");
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }

    setSuccess(true);
    setTimeout(() => navigate("/home"), 1200);
  }

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-[#050810]">

      {/* ── Capa de rayos de proyector ───────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Rayo principal de proyector */}
        <div
          className="absolute"
          style={{
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            height: "100%",
            background:
              "conic-gradient(from 270deg at 50% -5%, transparent 30deg, rgba(234,179,8,0.04) 60deg, rgba(234,179,8,0.025) 70deg, transparent 100deg)",
          }}
        />
        {/* Rayo secundario izquierdo */}
        <div
          className="absolute"
          style={{
            top: 0,
            left: 0,
            width: "60%",
            height: "100%",
            background:
              "conic-gradient(from 270deg at 10% -5%, transparent 15deg, rgba(59,130,246,0.03) 45deg, transparent 75deg)",
          }}
        />
        {/* Rayo secundario derecho */}
        <div
          className="absolute"
          style={{
            top: 0,
            right: 0,
            width: "60%",
            height: "100%",
            background:
              "conic-gradient(from 270deg at 90% -5%, transparent 15deg, rgba(168,85,247,0.03) 45deg, transparent 75deg)",
          }}
        />
      </div>

      {/* ── Partículas de polvo de cine ──────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-yellow-400"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              animation: `floatUp ${p.speed}s ${p.delay}s infinite linear`,
            }}
          />
        ))}
      </div>

      {/* ── Orbs de luz ambiental ─────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute rounded-full"
          style={{
            width: "40vw",
            height: "40vw",
            top: "-10vw",
            left: "50%",
            transform: "translateX(-50%)",
            background: "radial-gradient(circle, rgba(234,179,8,0.07) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "30vw",
            height: "30vw",
            bottom: "-5vw",
            left: "10%",
            background: "radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "25vw",
            height: "25vw",
            top: "30%",
            right: "5%",
            background: "radial-gradient(circle, rgba(168,85,247,0.04) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* ── Patrón de película (perforaciones) ───────────────────── */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 opacity-20 content-center hidden lg:block">
        {Array.from({ length: 32 }).map((_, i) => (
          <div
            key={i}
            className="mx-auto my-3 w-5 rounded-sm bg-neutral-700"
            style={{ height: 14, marginTop: i === 0 ? 24 : undefined }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 opacity-20 content-center hidden lg:block">
        {Array.from({ length: 32 }).map((_, i) => (
          <div
            key={i}
            className="mx-auto my-3 w-5 rounded-sm bg-neutral-700"
            style={{ height: 14, marginTop: i === 0 ? 24 : undefined }}
          />
        ))}
      </div>

      {/* ── Panel izquierdo: marca y ambiente ────────────────────── */}
      <div
        className="hidden lg:flex lg:w-3/5 flex-col items-center justify-center relative"
        style={{
          transition: "opacity 1s ease, transform 1s ease",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateX(0)" : "translateX(-40px)",
        }}
      >
        {/* Poster cinematográfico */}
          {/* Pantalla de cine para trailer */}
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl"
            style={{
              borderRadius: "20px",
              background: "linear-gradient(180deg, #0d1117 0%, #050810 100%)",
              border: "2px solid rgba(255,255,255,0.08)",
              boxShadow: "0 60px 100px -30px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.05)",
              aspectRatio: "16/9",
            }}
          >
            {/* Pantalla - Área del trailer */}
            <div
              className="relative w-full h-full flex items-center justify-center overflow-hidden"
              style={{ background: "linear-gradient(180deg, #1a1a2e 0%, #0d0d1a 100%)" }}
            >
              {/* Placeholder para video/trailer */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center z-10">
                  <p className="text-sm text-neutral-400">Reemplaza con tu video/iframe</p>
                </div>
              </div>
              {/* Efecto de luz de pantalla */}
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(100,100,255,0.15), transparent 70%)" }}
              />
            </div>
          </div>

          {/* Descripción */}
          <div className="text-center space-y-2 mt-8">
            <p className="text-neutral-300 text-lg font-semibold leading-relaxed max-w-2xl">
              Disfruta del mejor cine en <span className="text-yellow-400">alta definición</span>
            </p>
            <p className="text-neutral-500 text-sm max-w-2xl">
              Más de <span className="text-yellow-400 font-semibold">500 películas</span> disponibles. Tu próxima aventura cinematográfica te espera.
            </p>
          </div>
      </div>

      {/* ─────────────────── Panel derecho: formulario ─────────────────── */}
      <div className="flex flex-col w-full lg:w-2/5 items-center justify-center px-6 py-12">
        {/* Logo */}
          <div className="flex flex-col items-center gap-3 mb-5">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-2xl"
              style={{
                background: "linear-gradient(135deg, rgba(234,179,8,0.15) 0%, rgba(234,179,8,0.05) 100%)",
                border: "1px solid rgba(234,179,8,0.2)",
                boxShadow: "0 0 40px rgba(234,179,8,0.08), inset 0 1px 0 rgba(234,179,8,0.1)",
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-yellow-400">
                <path d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold tracking-[5px] text-yellow-500/70 uppercase mb-1">Bienvenido a</p>
              <h1 className="text-5xl font-black tracking-tight text-white" style={{ fontFamily: "'Helvetica Neue', sans-serif" }}>
                Cine<span className="text-yellow-400">App</span>
              </h1>
            </div>
          </div>

        <div
          className="w-full max-w-md"
          style={{
            transition: "opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(30px)",
          }}
        >
          {/* Card con efecto de ticket */}
          <div
            className={`relative overflow-visible rounded-3xl p-8 ${shake ? "animate-shake" : ""}`}
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
            <div className="mb-7 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-yellow-500/20" />
                <span className="text-[10px] font-bold tracking-[4px] text-yellow-500/60 uppercase px-2">Admit One</span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-yellow-500/20" />
              </div>
              <h2 className="text-2xl font-black text-white mb-1">Accede a tu cuenta</h2>
              <p className="text-sm text-neutral-500">Tu función empieza aquí</p>
            </div>

            {/* Divisor de ticket */}
            <div className="relative -mx-8 mb-7">
              <div className="border-t border-dashed border-white/[0.06]" />
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
                <p className="text-sm font-bold text-yellow-400">¡Que empiece la función!</p>
                <p className="text-xs text-neutral-500">Redirigiendo a cartelera...</p>
              </div>
            )}

            {/* Formulario */}
            {!success && (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
                      ref={emailRef}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="tu@correo.com"
                      autoComplete="email"
                      required
                      className="w-full bg-transparent pl-10 pr-4 py-3.5 text-sm text-white placeholder-neutral-600 outline-none"
                    />
                  </div>
                </div>

                {/* Password */}
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
                      autoComplete="current-password"
                      required
                      className="w-full bg-transparent pl-10 pr-12 py-3.5 text-sm text-white placeholder-neutral-600 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-400 transition-colors focus:outline-none"
                    >
                      {showPassword ? (
                        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.8">
                          <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.8">
                          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
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
                  disabled={loading || !email || !password}
                  className="relative w-full overflow-hidden rounded-xl py-4 text-sm font-bold tracking-widest uppercase transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500/40 disabled:cursor-not-allowed mt-4"
                  style={{
                    background: loading || !email || !password
                      ? "rgba(255,255,255,0.05)"
                      : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                    color: loading || !email || !password ? "rgba(255,255,255,0.2)" : "#0a0a0a",
                    boxShadow: !loading && email && password
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
                      Validando entrada...
                    </span>
                  ) : (
                    "Entrar a la sala 🎬"
                  )}
                </button>

                {/* Hint de prueba */}
                <div
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 mt-1"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 shrink-0 text-neutral-600" stroke="currentColor" strokeWidth="2">
                    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-[11px] text-neutral-600">
                    Demo: <span className="text-neutral-500 font-mono">milton@cine.com</span> / <span className="text-neutral-500 font-mono">123456</span>
                  </p>
                </div>
              </form>
            )}

            {/* Footer */}
            <div className="relative mt-6">
              <div className="border-t border-dashed border-white/[0.05] -mx-8 mb-5">
                <div className="absolute left-0 -top-2 w-4 h-4 rounded-full" style={{ background: "#050810" }} />
                <div className="absolute right-0 -top-2 w-4 h-4 rounded-full" style={{ background: "#050810" }} />
              </div>
              <p className="text-center text-[11px] text-neutral-600">
                ¿No tienes cuenta?{" "}
                <Link to="/auth/register" className="text-yellow-500 hover:text-yellow-400 transition-colors font-semibold">
                  Regístrate gratis
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Keyframes ─────────────────────────────────────────────── */}
      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0px) translateX(0px); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-8px); }
          30% { transform: translateX(8px); }
          45% { transform: translateX(-6px); }
          60% { transform: translateX(6px); }
          75% { transform: translateX(-3px); }
          90% { transform: translateX(3px); }
        }
        .animate-shake { animation: shake 0.6s ease; }
      `}</style>
    </div>
  );
};
