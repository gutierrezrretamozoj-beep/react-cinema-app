import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { THEATERS, type TheaterComplex } from "../data/theatersData";

// TheaterCard: Tarjeta de complejo con mini-carrusel automático de 3 fotos cada 3 segundos
const TheaterCard = ({ theater }: { theater: TheaterComplex }) => {
  const navigate = useNavigate();
  const [photoIndex, setPhotoIndex] = useState(0);

  // Rotación automática cada 3 segundos como pidió el usuario
  useEffect(() => {
    const interval = setInterval(() => {
      setPhotoIndex((prev) => (prev + 1) % theater.photos.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [theater.photos.length]);

  const currentPhoto = theater.photos[photoIndex];

  const handleGoToTheaterBillboard = () => {
    navigate(`/movies?theater=${encodeURIComponent(theater.name)}`);
  };

  return (
    <div className="flex flex-col rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-900/60 shadow-xl transition-all duration-300 hover:border-yellow-500/40 hover:shadow-2xl hover:shadow-yellow-500/5 group text-left">
      {/* Mini-carrusel de 2-3 fotos */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-neutral-950">
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

        {/* Gradientes y viñeta */}
        <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/25 to-transparent" />

        {/* Badge superior con Ciudad */}
        <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-neutral-700/60 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
          <span className="text-[11px] font-bold text-neutral-200 uppercase tracking-wider">
            {theater.city}
          </span>
        </div>

        {/* Subtítulo de la foto activa */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="text-[10px] font-medium text-neutral-300 bg-neutral-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-neutral-800">
            📷 {currentPhoto.caption}
          </span>

          {/* Indicadores de fotos */}
          <div className="flex gap-1.5">
            {theater.photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setPhotoIndex(i)}
                aria-label={`Ver foto ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  photoIndex === i ? "w-5 bg-yellow-500" : "w-1.5 bg-neutral-600"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 gap-4">
        <div>
          <h3 className="text-xl font-bold text-neutral-100 group-hover:text-yellow-400 transition-colors">
            {theater.name}
          </h3>
          <p className="mt-1 text-xs text-neutral-400 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-yellow-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{theater.address}</span>
          </p>
        </div>

        <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
          {theater.description}
        </p>

        {/* Chips con salas y tecnologías disponibles */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">
            Salas & Tecnologías Disponibles:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {theater.formats.map((fmt) => (
              <span
                key={fmt}
                className="rounded-lg px-2.5 py-1 text-[10px] font-bold font-mono tracking-wide bg-neutral-800/80 border border-neutral-700/60 text-yellow-400/90"
              >
                {fmt}
              </span>
            ))}
          </div>
        </div>

        {/* Botón de acción para ver cartelera de este cine */}
        <div className="mt-auto pt-2">
          <button
            onClick={handleGoToTheaterBillboard}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-yellow-500 hover:bg-yellow-400 text-neutral-950 transition-all hover:shadow-lg hover:shadow-yellow-500/20 active:scale-98 cursor-pointer"
          >
            <span>Ver Cartelera en {theater.name.split(" ")[1] || "este cine"}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export const CinemaTheatersSection = () => {
  return (
    <section className="w-full flex flex-col gap-6 pt-4">
      <div className="flex flex-col gap-1 text-left px-1">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-yellow-500" />
          <h2 className="text-xl sm:text-2xl font-black text-neutral-100 tracking-tight font-serif">
            Nuestros Cines
          </h2>
        </div>
        <p className="text-xs text-neutral-400 pl-4">
          Conoce nuestras sedes, salas premium IMAX, 4DX y comodidades en la ciudad
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full justify-items-center">
        {THEATERS.map((theater) => (
          <div key={theater.id} className="w-full max-w-[410px]">
            <TheaterCard theater={theater} />
          </div>
        ))}
      </div>
    </section>
  );
};
