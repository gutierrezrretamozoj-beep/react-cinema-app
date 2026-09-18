import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { THEATERS, type TheaterComplex } from "../data/theatersData";

// TheaterCard: Tarjeta compacta de complejo con proporción estable 3:4 (2:3 en móvil) y mini-carrusel
const TheaterCard = ({ theater }: { theater: TheaterComplex }) => {
  const navigate = useNavigate();
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhotoIndex((prev) => (prev + 1) % theater.photos.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [theater.photos.length]);

  const currentPhoto = theater.photos[photoIndex];

  const handleGoToTheaterBillboard = () => {
    navigate(`/movies?theater=${encodeURIComponent(theater.name)}`);
  };

  return (
    <div className="group flex flex-col rounded-2xl sm:rounded-3xl overflow-hidden border border-cinema-border bg-cinema-surface/75 shadow-lg transition-all duration-300 hover:border-cinema-turquoise/50 hover:shadow-2xl hover:shadow-cinema-primary/20 hover:-translate-y-1.5 text-left w-full aspect-2/3 sm:aspect-3/4 select-none relative">
      {/* 1. Mini-carrusel de fotos superior (ocupa ~39% de la tarjeta) */}
      <div className="relative h-[39%] w-full overflow-hidden bg-cinema-bg">
        {theater.photos.map((photo, i) => (
          <img
            key={i}
            src={photo.url}
            alt={`${theater.name} - ${photo.caption}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              photoIndex === i ? "opacity-90 scale-100" : "opacity-0 scale-105 pointer-events-none"
            }`}
          />
        ))}

        {/* Gradiente viñeta inferior */}
        <div className="absolute inset-0 bg-linear-to-t from-cinema-surface via-transparent to-transparent" />

        {/* Badge superior con Ciudad */}
        <div className="absolute top-2.5 left-2.5 bg-cinema-bg/85 backdrop-blur-md px-2 py-0.5 rounded-full border border-cinema-border flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-cinema-turquoise animate-pulse" />
          <span className="text-[9px] sm:text-[10px] font-bold text-cinema-text uppercase tracking-wider font-mono">
            {theater.city}
          </span>
        </div>

        {/* Pie de foto e indicadores */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <span className="text-[8px] sm:text-[9px] font-medium text-cinema-muted bg-cinema-bg/80 backdrop-blur-md px-2 py-0.5 rounded border border-cinema-border line-clamp-1 max-w-[65%]">
            📷 {currentPhoto.caption}
          </span>

          {/* Indicadores de fotos */}
          <div className="flex gap-1 pointer-events-auto">
            {theater.photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setPhotoIndex(i)}
                aria-label={`Ver foto ${i + 1}`}
                className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                  photoIndex === i ? "w-3 bg-cinema-turquoise" : "w-1 bg-neutral-500/70"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 2. Contenido estructurado de la tarjeta con altura fija y sin desbordes */}
      <div className="p-2.5 sm:p-3.5 flex flex-col justify-between flex-1 bg-linear-to-b from-cinema-surface/90 to-cinema-surface-card/90 overflow-hidden">
        {/* Nombre y dirección */}
        <div className="flex flex-col gap-0.5">
          <h3 className="text-xs sm:text-sm font-bold text-cinema-text group-hover:text-cinema-turquoise transition-colors line-clamp-1">
            {theater.name}
          </h3>
          <p className="text-[9px] sm:text-[10.5px] text-cinema-muted flex items-center gap-1 line-clamp-1">
            <svg
              className="w-3 h-3 text-cinema-orange shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{theater.address}</span>
          </p>
        </div>

        {/* Chips de salas y tecnologías en una sola fila compacta */}
        <div className="flex items-center gap-1 my-auto pt-0.5 overflow-hidden">
          {theater.formats.slice(0, 2).map((fmt) => (
            <span
              key={fmt}
              className="rounded px-1.5 py-0.5 text-[8px] sm:text-[9px] font-bold font-mono tracking-tight bg-cinema-surface-card border border-cinema-border text-cinema-turquoise shrink-0"
            >
              {fmt}
            </span>
          ))}
          {theater.formats.length > 2 && (
            <span className="rounded px-1.5 py-0.5 text-[8px] font-mono text-cinema-muted/80 bg-white/5 shrink-0">
              +{theater.formats.length - 2}
            </span>
          )}
        </div>

        {/* Botón de acción para ver cartelera de este cine */}
        <div className="pt-1.5 mt-auto">
          <button
            onClick={handleGoToTheaterBillboard}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-wider bg-cinema-primary hover:bg-cinema-primary-hover text-white transition-all hover:shadow-lg hover:shadow-cinema-primary/30 active:scale-98 cursor-pointer"
          >
            <span>Ver Cartelera</span>
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// CinemaTheatersSection: Cuadrícula responsiva de cines (2 cols móvil/tablets, 4 cols desktop)
export const CinemaTheatersSection = () => {
  return (
    <section className="w-full flex flex-col gap-6 pt-4">
      <div className="flex flex-col gap-1 text-left px-1">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cinema-turquoise animate-pulse" />
          <h2 className="text-lg sm:text-xl font-normal text-cinema-text tracking-wider uppercase font-monument">
            Nuestros Cines
          </h2>
        </div>
        <p className="text-xs text-cinema-muted pl-4">
          Conoce nuestras sedes, salas premium IMAX, 4DX y comodidades en la ciudad
        </p>
      </div>

      {/* Grid: 2 columnas en móvil y tablet, 4 columnas en desktop */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5 w-full">
        {THEATERS.map((theater) => (
          <TheaterCard key={theater.id} theater={theater} />
        ))}
      </div>
    </section>
  );
};
