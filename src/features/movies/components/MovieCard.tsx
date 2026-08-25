import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Movie, Showtime } from '../interfaces';
import { Badge } from './Badge';

interface MovieCardProps {
  movie: Movie;
  onBuy?: (movie: Movie, time: string) => void;
}

// MovieCard: Tarjeta principal de película con diseño de boleto rasgable
// Incluye poster, badges, horarios, botón comprar con animación 3D de desprendimiento.
export const MovieCard = ({ movie, onBuy }: MovieCardProps) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isPeeling, setIsPeeling] = useState(false);

  const { id, title, genre, rating, status, posterUrl, duration, synopsis, showtimes } = movie;

  const isShowtimeAvailable = (st: Showtime) => st.isActive && !st.isSoldOut;

  const handleBuy = () => {
    if (!selectedTime || isPeeling) return;
    setIsPeeling(true);
    onBuy?.(movie, selectedTime);
  };

  return (
    <div
      id={`movie-card-${id}`}
      className="w-full max-w-72 flex flex-col items-center select-none mx-auto group relative transition-all duration-500"
    >
      {/* Cuerpo superior: poster + detalles */}
      <div className="w-full bg-neutral-900 border-t border-x border-neutral-800 rounded-t-2xl overflow-hidden flex flex-col z-10 transition-all duration-300 group-hover:border-yellow-500/20">
        {/* Poster */}
        <div className="relative h-56 w-full bg-neutral-950 overflow-hidden">
          <img
            src={posterUrl}
            alt={title}
            className="w-full h-full object-cover opacity-85 transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-neutral-950/40" />

          {/* Badges top-left: género + pre-compra */}
          <div className="absolute top-3 left-3 flex gap-1.5 items-center">
            <Badge variant="genre" text={genre} />
            {status === 'coming-soon' && <Badge variant="pre-purchase" text="Precompra" />}
          </div>

          {/* Badge top-right: clasificación */}
          <Badge
            variant="rating"
            text={rating}
            ratingType={rating}
            className="absolute top-3 right-3"
          />
        </div>

        {/* Info */}
        <div className="p-5 flex flex-col gap-3.5 bg-neutral-900">
          <div>
            <h2 className="text-base font-bold text-neutral-100 leading-snug line-clamp-1 group-hover:text-yellow-400 transition-colors">
              {title}
            </h2>
            <p className="text-[10px] text-neutral-400 mt-0.5">
              {duration} • {genre}
              {movie.director && ` • Dir. ${movie.director}`}
            </p>
            {movie.languages && movie.languages.length > 0 && (
              <p className="text-[9px] text-neutral-500 mt-0.5">
                {movie.languages.join(' / ')}
              </p>
            )}
          </div>

          <p className="text-[11px] text-neutral-400 leading-relaxed line-clamp-2">{synopsis}</p>

          {/* Formatos */}
          {movie.formats && movie.formats.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {movie.formats.map((fmt) => (
                <span
                  key={fmt}
                  className="text-[9px] font-bold px-2 py-0.5 rounded border border-neutral-700 text-neutral-400 bg-neutral-950/60"
                >
                  {fmt}
                </span>
              ))}
            </div>
          )}

          {/* Horarios */}
          <div>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">
              Horarios disponibles
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {showtimes.map((st) => {
                const available = isShowtimeAvailable(st);
                const isSelected = selectedTime === st.time;
                return (
                  <button
                    key={st.id}
                    disabled={!available || isPeeling}
                    onClick={() => setSelectedTime(st.time)}
                    aria-disabled={!available}
                    className={`py-1.5 text-[10px] font-mono font-bold rounded-lg border transition-all duration-150 ${
                      !available
                        ? 'bg-neutral-950 border-neutral-900 text-neutral-600 cursor-not-allowed line-through'
                        : isSelected
                        ? 'bg-yellow-500 border-yellow-500 text-neutral-950 shadow-md shadow-yellow-500/10'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-yellow-500/30 hover:text-yellow-400'
                    }`}
                  >
                    {st.isSoldOut ? (
                      <span className="line-through opacity-50">{st.time}</span>
                    ) : (
                      st.time
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Divisor estilo boleto rasgable */}
      <div className="relative w-full h-6 bg-neutral-900 flex items-center justify-between z-10">
        <div className="absolute -left-3 h-6 w-6 rounded-full bg-neutral-950 z-20" />
        <div className="flex-1 border-b-2 border-dashed border-neutral-800/80 mx-3" />
        <div className="absolute -right-3 h-6 w-6 rounded-full bg-neutral-950 z-20" />
      </div>

      {/* Talón inferior: botón comprar / ticket confirmado */}
      <div className="w-full h-20 relative perspective-[800px] z-0">
        <AnimatePresence>
          {!isPeeling ? (
            <motion.div
              key="stub-button"
              initial={{ rotateX: 0, rotateY: 0, rotateZ: 0, skewX: 0, x: 0, y: 0, opacity: 1 }}
              exit={{
                rotateX: [0, 15, -30, -65],
                rotateY: [0, -10, 25, 45],
                rotateZ: [0, 12, 35, 60],
                skewX: [0, 15, -10, 0],
                x: [0, -10, -25, -45],
                y: [0, 15, 65, 180],
                opacity: [1, 1, 0.7, 0],
              }}
              transition={{ duration: 1.1, times: [0, 0.25, 0.6, 1], ease: 'easeInOut' }}
              style={{ transformOrigin: 'top right' }}
              className="absolute inset-0 w-full bg-neutral-900 border-x border-b border-neutral-800 rounded-b-2xl p-4 flex items-center justify-center shadow-md overflow-hidden"
            >
              <button
                onClick={handleBuy}
                disabled={!selectedTime}
                className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md relative z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 ${
                  !selectedTime
                    ? 'bg-neutral-950 border border-neutral-900 text-neutral-600 cursor-not-allowed'
                    : 'bg-yellow-500 hover:bg-yellow-400 text-neutral-950 active:scale-95 hover:shadow-lg hover:shadow-yellow-500/20'
                }`}
              >
                {status === 'coming-soon' ? 'Precomprar Ticket' : 'Comprar Ticket'}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="stub-confirmed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="absolute inset-0 w-full bg-neutral-900/30 border-x border-b border-dashed border-neutral-800/80 rounded-b-2xl p-2.5 flex flex-col items-center justify-center gap-1.5"
            >
              <svg className="w-10 h-10 text-yellow-500/80 opacity-80" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 2h6v6H2V2zm1 1v4h4V3H3zm1 1h2v2H4V4zM16 2h6v6h-6V2zm1 1v4h4V3h-3zm1 1h2v2h-2V4zM2 16h6v6H2v-6zm1 1v4h4V3H3zm1 1h2v2H4v-2z" />
                <path d="M12 2h2v2h-2zm0 4h2v2h-2zm4 8h2v2h-2zm4 0h2v2h-2zm-8 4h2v2h-2zm4 4h2v2h-2zm-8-4h2v2H8zm4-8h2v2h-2zm8 4h2v2h-2z" />
              </svg>
              <div className="flex flex-col items-center text-center">
                <span className="text-[8px] font-bold text-neutral-200 uppercase tracking-widest leading-none">
                  TICKET COMPRADO • {selectedTime}
                </span>
                <span className="text-[7.5px] text-neutral-400 mt-1 max-w-[190px] leading-tight">
                  Escanea el código o revisa tu correo para ver tu boleto.
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
