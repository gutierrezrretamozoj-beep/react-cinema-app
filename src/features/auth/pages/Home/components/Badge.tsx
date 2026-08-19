import type { MovieRating } from "@/features/movies";

interface BadgeProps {
  variant: 'genre' | 'rating' | 'featured' | 'pre-purchase';
  text: string;
  ratingType?: MovieRating;
  className?: string;
}

// Badge: Componente modular de etiquetas/insignias reutilizables
// Muestra badges de género, clasificación por edad (con colores semánticos), destacados y precompra con esquinas rounded-lg.
export const Badge = ({ variant, text, ratingType, className = "" }: BadgeProps) => {
  let styleClasses = "";

  // Switch de estilos: Asigna clases CSS Tailwind basadas en la variante seleccionada
  switch (variant) {
    case 'genre':
      styleClasses = "bg-neutral-900/80 backdrop-blur-md text-neutral-300 border border-neutral-700/50 uppercase tracking-wider";
      break;
    case 'featured':
      styleClasses = "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 uppercase tracking-wider";
      break;
    case 'pre-purchase':
      styleClasses = "bg-purple-500/20 text-purple-400 border border-purple-500/30 uppercase tracking-wider animate-pulse";
      break;
    case 'rating':
      if (ratingType === 'C') {
        styleClasses = "bg-red-500/20 border-red-500/40 text-red-400";
      } else if (ratingType === 'B15') {
        styleClasses = "bg-yellow-500/20 border-yellow-500/40 text-yellow-400";
      } else {
        styleClasses = "bg-green-500/20 border-green-500/40 text-green-400";
      }
      break;
  }

  return (
    <span className={`text-[9px] font-bold px-2.5 py-1 rounded-lg border shadow-sm select-none ${styleClasses} ${className}`}>
      {text}
    </span>
  );
};
