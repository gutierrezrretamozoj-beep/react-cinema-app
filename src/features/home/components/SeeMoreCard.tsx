import { Link } from "react-router";

interface SeeMoreCardProps {
  to: string;
  label?: string;
  count?: number;
  subtitle?: string;
}

// SeeMoreCard: Tarjeta "Ver más" de cierre de carrusel idéntica al boceto
export const SeeMoreCard = ({
  to,
  label = "Ver más",
  count,
  subtitle = "Explorar catálogo completo",
}: SeeMoreCardProps) => {
  return (
    <Link
      to={to}
      className="flex-none w-[160px] sm:w-[180px] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-800 bg-neutral-900/30 p-6 text-center transition-all duration-300 hover:border-yellow-500/80 hover:bg-yellow-500/5 hover:scale-[1.02] group select-none cursor-pointer"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-800 border border-neutral-700 text-yellow-400 transition-all duration-300 group-hover:bg-yellow-500 group-hover:text-neutral-950 group-hover:scale-110 shadow-lg shadow-black/40">
        <svg
          className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </div>

      <div className="mt-5 flex flex-col items-center gap-1">
        <span className="text-sm font-extrabold uppercase tracking-wider text-neutral-100 group-hover:text-yellow-400 transition-colors">
          {label}
        </span>
        {count !== undefined && (
          <span className="text-[11px] font-mono text-neutral-400">
            +{count} títulos
          </span>
        )}
        <span className="mt-1 text-[10px] text-neutral-500 max-w-[130px] leading-tight">
          {subtitle}
        </span>
      </div>
    </Link>
  );
};
