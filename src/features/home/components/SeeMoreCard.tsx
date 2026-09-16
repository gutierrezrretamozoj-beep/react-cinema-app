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
      className="flex-none w-41.25 sm:w-55 md:w-60 aspect-2/3 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-black/30 backdrop-blur-2xl p-4 sm:p-6 text-center transition-all duration-200  hover:bg-black/50 hover:border-4 hover:border-x-cinema-turquoise/25 hover:border-y-transparent hover:-translate-y-1.5 group/more select-none cursor-pointer shadow-lg"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cinema-surface/40 border border-none text-cinema-primary transition-all duration-300 group-hover/more:bg-cinema-primary group-hover/more:text-white group-hover/more:scale-110 shadow-lg shadow-black/40">
        <svg
          className="w-6 h-6 transition-transform duration-300 group-hover/more:translate-x-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </div>

      <div className="mt-5 flex flex-col items-center gap-1">
        <span className="text-sm font-extrabold uppercase tracking-wider text-cinema-muted group-hover/more:text-cinema-text transition-colors">
          {label}
        </span>
        {count !== undefined && (
          <span className="text-[11px] font-mono text-cinema-muted">
            +{count} títulos
          </span>
        )}
        <span className="mt-1 text-[10px] text-cinema-dim max-w-32 leading-tight">
          {subtitle}
        </span>
      </div>
    </Link>
  );
};
