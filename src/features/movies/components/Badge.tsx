import { getRatingBadgeProps, type Movie } from "../data/movieData";

interface BadgeProps {
  variant: 'genre' | 'rating' | 'featured' | 'pre-purchase';
  text: string;
  ratingType?: Movie['rating'];
  className?: string;
}

// Badge: Componente modular de etiquetas/insignias reutilizables
export const Badge = ({ variant, text, ratingType, className = "" }: BadgeProps) => {
  let styleClasses = "";
  let displayText = text;

  switch (variant) {
    case 'genre':
      styleClasses = "bg-black/40 backdrop-blur-md text-cinema-text/90 border border-white/10 uppercase tracking-wider";
      break;
    case 'featured':
      styleClasses = "bg-cinema-electric/15 text-cinema-electric border border-cinema-electric/30 uppercase tracking-wider";
      break;
    case 'pre-purchase':
      styleClasses = "bg-cinema-primary/30 text-cinema-turquoise border border-cinema-primary/50 uppercase tracking-wider animate-pulse";
      break;
    case 'rating': {
      const ratingConfig = getRatingBadgeProps(ratingType || text);
      styleClasses = ratingConfig.badgeClass;
      displayText = ratingConfig.label;
      break;
    }
  }

  return (
    <span className={`text-[9px] font-bold px-2.5 py-1 rounded-lg border shadow-sm select-none ${styleClasses} ${className}`}>
      {displayText}
    </span>
  );
};
