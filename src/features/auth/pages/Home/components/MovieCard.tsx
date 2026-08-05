import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Movie } from "../data/movieData";
import { Badge } from "./Badge";

interface MovieCardProps {
  movie: Movie;
  onBuy?: (movie: Movie, selectedTime: string) => void;
}

// MovieCard: Componente de tarjeta de película estructurado como un boleto físico
// Presenta información general en la parte superior y un talón inferior despegable con animación 3D de rasgado.
export const MovieCard = ({ movie, onBuy }: MovieCardProps) => {
  const { id, title, genre, rating, posterUrl, duration, synopsis, showtimes } = movie;

  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isPeeling, setIsPeeling] = useState<boolean>(false);

  // isTimeAvailable: Simulación de disponibilidad de horarios
  // Retorna falso en horarios selectos según el ID de la película para simular funciones agotadas y probar estados deshabilitados.
  const isTimeAvailable = (time: string, index: number) => {
    return !((Number(id) % 2 === 0 && index === 0) || (Number(id) % 3 === 0 && index === 2));
  };

  // handleBuy: Acción de compra
  // Inicia la animación de desprendimiento físico del talón y dispara la confirmación de compra tras 1.2 segundos.
  const handleBuy = () => {
    if (!selectedTime || isPeeling) return;

    setIsPeeling(true);

    setTimeout(() => {
      onBuy?.(movie, selectedTime);
    }, 1200);
  };

  return (
    // movie-card (Wrapper): Contenedor exterior de la tarjeta
    // Utiliza un ID dinámico para permitir el scroll suave y ring-focus dorado desde el carrusel de destacados.
    <div id={`movie-card-${id}`} className="w-full max-w-72 flex flex-col items-center select-none mx-auto group relative transition-all duration-500">
      
      {/* Cuerpo superior: Contenedor de detalles del boleto */}
      {/* Contiene el póster, la categoría, la sinopsis y la cuadrícula de showtimes. */}
      <div className="w-full bg-neutral-900 border-t border-x border-neutral-800 rounded-t-2xl overflow-hidden flex flex-col z-10 transition-all duration-300 group-hover:border-yellow-500/20">
        <div className="relative h-56 w-full bg-neutral-950 overflow-hidden">
          <img
            src={posterUrl}
            alt={title}
            className="w-full h-full object-cover opacity-85 transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-neutral-900 via-transparent to-neutral-950/40" />
          
          <div className="absolute top-3 left-3 flex gap-1.5 items-center">
            <Badge variant="genre" text={genre} />
            {movie.status === 'coming-soon' && (
              <Badge variant="pre-purchase" text="Precompra" />
            )}
          </div>
          <Badge
            variant="rating"
            text={rating}
            ratingType={rating}
            className="absolute top-3 right-3"
          />
        </div>

        <div className="p-5 flex flex-col gap-3.5 bg-neutral-900">
          <div>
            <h2 className="text-base font-bold text-neutral-100 leading-snug line-clamp-1 group-hover:text-yellow-400 transition-colors">
              {title}
            </h2>
            <p className="text-[10px] text-neutral-400 mt-0.5">
              {duration} • {genre}
            </p>
          </div>

          <p className="text-[11px] text-neutral-400 leading-relaxed line-clamp-2">
            {synopsis}
          </p>

          <div>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">
              Horarios disponibles
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {showtimes.map((time, index) => {
                const available = isTimeAvailable(time, index);
                const isSelected = selectedTime === time;
                return (
                  <button
                    key={index}
                    disabled={!available || isPeeling}
                    onClick={() => setSelectedTime(time)}
                    className={`py-1.5 text-[10px] font-mono font-bold rounded-lg border transition-all duration-150 ${
                      !available
                        ? 'bg-neutral-950 border-neutral-900 text-neutral-600 cursor-not-allowed line-through'
                        : isSelected
                        ? 'bg-yellow-500 border-yellow-500 text-neutral-950 shadow-md shadow-yellow-500/10'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-yellow-500/30 hover:text-yellow-400'
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Divisor: Línea de corte intermedio y muescas circulares */}
      {/* Contiene los círculos de enmascaramiento estilo Login y el trazo discontinuo de perforación del papel. */}
      <div className="relative w-full h-6 bg-neutral-900 flex items-center justify-between z-10">
        <div className="absolute -left-3 h-6 w-6 rounded-full bg-neutral-950 z-20" />
        <div className="flex-1 border-b-2 border-dashed border-neutral-800/80 mx-3" />
        <div className="absolute -right-3 h-6 w-6 rounded-full bg-neutral-950 z-20" />
      </div>

      {/* Talón inferior: Sección despegable interactiva */}
      {/* Soporta la física 3D en perspectiva del desprendimiento final y revela el ticket comprado. */}
      <div className="w-full h-20 relative perspective-distant z-0">
        <AnimatePresence>
          {!isPeeling ? (
            // motion.div (Stub active): Animación 3D del talón despegable
            // Rota sobre los tres ejes de perspectiva y se desvanece simulando caer físicamente por gravedad.
            <motion.div
              key="stub-button"
              initial={{ rotateX: 0, rotateY: 0, rotateZ: 0, x: 0, y: 0, opacity: 1 }}
              exit={{
                rotateX: -45,
                rotateY: -35,
                rotateZ: 25,
                x: 30,
                y: 110,
                opacity: 0,
              }}
              transition={{
                duration: 0.9,
                ease: [0.32, 0, 0.67, 0],
              }}
              style={{ transformOrigin: 'top right' }}
              className="absolute inset-0 w-full bg-neutral-900 border-x border-b border-neutral-800 rounded-b-2xl p-4 flex items-center justify-center shadow-md overflow-hidden"
            >
              <motion.div
                initial={{ opacity: 0 }}
                exit={{ opacity: 0.8 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-linear-to-tr from-black/90 via-black/45 to-transparent pointer-events-none"
              />

              <button
                onClick={handleBuy}
                disabled={!selectedTime}
                className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md relative z-10 ${
                  !selectedTime
                    ? 'bg-neutral-950 border border-neutral-900 text-neutral-600 cursor-not-allowed'
                    : 'bg-yellow-500 hover:bg-yellow-400 text-neutral-950 active:scale-95 hover:shadow-lg hover:shadow-yellow-500/20'
                }`}
              >
                {movie.status === 'coming-soon' ? 'Precomprar Ticket' : 'Comprar Ticket'}
              </button>
            </motion.div>
          ) : (
            // motion.div (Stub confirmed): Vista final tras el desgarre
            // Muestra un código de barras digital y el resumen del horario seleccionado.
            <motion.div
              key="stub-confirmed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="absolute inset-0 w-full bg-neutral-900/30 border-x border-b border-dashed border-neutral-800/80 rounded-b-2xl p-3 flex flex-col items-center justify-center"
            >
              <div className="flex gap-0.5 items-center h-6 justify-center w-full opacity-65">
                <div className="w-px h-full bg-neutral-500" />
                <div className="w-0.5 h-full bg-neutral-500" />
                <div className="w-px h-full bg-neutral-500" />
                <div className="w-1 h-full bg-neutral-500" />
                <div className="w-0.5 h-full bg-neutral-500" />
                <div className="w-px h-full bg-neutral-500" />
                <div className="w-0.5 h-full bg-neutral-500" />
                <div className="w-px h-full bg-neutral-500" />
                <div className="w-0.5 h-full bg-neutral-500" />
                <div className="w-1 h-full bg-neutral-500" />
                <div className="w-px h-full bg-neutral-500" />
                <div className="w-0.5 h-full bg-neutral-500" />
                <div className="w-px h-full bg-neutral-500" />
                <div className="w-0.5 h-full bg-neutral-500" />
              </div>
              <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest mt-1">
                TICKET COMPRADO • {selectedTime}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
