import { useEffect, useState } from "react";
import { RegisterForm } from "../../components";

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
  Array.from({ length: count }, (_, id) => ({
    id,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    speed: Math.random() * 25 + 15,
    opacity: Math.random() * 0.4 + 0.1,
    delay: Math.random() * 10,
  }));

export const RegisterPage = () => {
  const [particles] = useState(() => generateParticles(35));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-[#050810]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "conic-gradient(from 270deg at 50% -5%, transparent 30deg, rgba(234,179,8,0.04) 60deg, rgba(234,179,8,0.025) 70deg, transparent 100deg)" }} />
        <div className="absolute inset-y-0 left-0 w-3/5" style={{ background: "conic-gradient(from 270deg at 10% -5%, transparent 15deg, rgba(59,130,246,0.03) 45deg, transparent 75deg)" }} />
        <div className="absolute inset-y-0 right-0 w-3/5" style={{ background: "conic-gradient(from 270deg at 90% -5%, transparent 15deg, rgba(168,85,247,0.03) 45deg, transparent 75deg)" }} />
        <div className="absolute top-[-10vw] left-1/2 h-[40vw] w-[40vw] -translate-x-1/2" style={{ background: "radial-gradient(circle, rgba(234,179,8,0.07) 0%, transparent 70%)" }} />
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div key={particle.id} className="absolute rounded-full bg-yellow-400" style={{ left: `${particle.x}%`, top: `${particle.y}%`, width: particle.size, height: particle.size, opacity: particle.opacity, animation: `floatUp ${particle.speed}s ${particle.delay}s infinite linear` }} />
        ))}
      </div>

      <div className="flex w-full flex-col items-center justify-center px-6 py-5 lg:w-5/5">
        <div className="mb-3 flex flex-col items-center gap-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(234,179,8,0.15) 0%, rgba(234,179,8,0.05) 100%)", border: "1px solid rgba(234,179,8,0.2)", boxShadow: "0 0 40px rgba(234,179,8,0.08), inset 0 1px 0 rgba(234,179,8,0.1)" }}>
            <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-yellow-400"><path d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div className="text-center"><p className="mb-1 text-xs font-bold uppercase tracking-[5px] text-yellow-500/70">Bienvenido a</p><h1 className="text-4xl font-black tracking-tight text-white">Cine<span className="text-yellow-400">App</span></h1></div>
        </div>
        <div className="w-full max-w-md" style={{ transition: "opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s", opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(30px)" }}>
          <RegisterForm />
        </div>
      </div>


      <style>{`\n        @keyframes floatUp {\n          0% { transform: translateY(0) translateX(0); opacity: 0; }\n          10%, 90% { opacity: 1; }\n          100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }\n        }\n      `}</style>
    </div>
  );
};