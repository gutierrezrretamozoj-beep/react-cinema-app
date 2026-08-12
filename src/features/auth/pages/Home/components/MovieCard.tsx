import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Movie } from "../data/movieData";
import { Badge } from "./Badge";

interface MovieCardProps {
  movie: Movie;
  onBuy?: (movie: Movie, selectedTime: string) => void;
}

// MovieCard: Componente de tarjeta de película estructurado como un boleto físico.
// Presenta información general en la parte superior y un talón inferior despegable
// con animación 3D de rasgado.
export const MovieCard = ({ movie, onBuy }: MovieCardProps) => {
  const {
    id,
    title,
    genre,
    rating,
    posterUrl,
    duration,
    synopsis,
    showtimes,
  } = movie;

  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isPeeling, setIsPeeling] = useState(false);

  // Simulación de disponibilidad de horarios.
  const isTimeAvailable = (time: string, index: number) => {
    void time;

    return !(
      (Number(id) % 2 === 0 && index === 0) ||
      (Number(id) % 3 === 0 && index === 2)
    );
  };

  // Acción de compra.
  const handleBuy = () => {
    if (!selectedTime || isPeeling) return;

    setIsPeeling(true);

    window.setTimeout(() => {
      onBuy?.(movie, selectedTime);
    }, 1200);
  };

  return (
    <div
      id={`movie-card-${id}`}
      className="group relative mx-auto flex w-full max-w-72 select-none flex-col items-center transition-all duration-500"
    >
      {/* =========================
          CUERPO SUPERIOR
      ========================== */}

      <div className="z-10 flex w-full flex-col overflow-hidden rounded-t-2xl border-x border-t border-neutral-800 bg-neutral-900 transition-all duration-300 group-hover:border-yellow-500/20">
        <div className="relative h-56 w-full overflow-hidden bg-neutral-950">
          <img
            src={posterUrl}
            alt={title}
            className="h-full w-full object-cover opacity-85 transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-neutral-950/40" />

          <div className="absolute left-3 top-3 flex items-center gap-1.5">
            <Badge variant="genre" text={genre} />

            {movie.status === "coming-soon" && (
              <Badge
                variant="pre-purchase"
                text="Precompra"
              />
            )}
          </div>

          <Badge
            variant="rating"
            text={rating}
            ratingType={rating}
            className="absolute right-3 top-3"
          />
        </div>

        <div className="flex flex-col gap-3.5 bg-neutral-900 p-5">
          <div>
            <h2 className="overflow-hidden text-ellipsis whitespace-nowrap text-base font-bold leading-snug text-neutral-100 transition-colors group-hover:text-yellow-400">
              {title}
            </h2>

            <p className="mt-0.5 text-[10px] text-neutral-400">
              {duration} • {genre}
            </p>
          </div>

          <p className="overflow-hidden max-h-[3rem] text-[11px] leading-relaxed text-neutral-400">
            {synopsis}
          </p>

          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              Horarios disponibles
            </p>

            <div className="grid grid-cols-3 gap-1.5">
              {showtimes.map((time, index) => {
                const available = isTimeAvailable(time, index);
                const isSelected = selectedTime === time;

                return (
                  <button
                    key={time}
                    type="button"
                    disabled={!available || isPeeling}
                    onClick={() => setSelectedTime(time)}
                    className={`rounded-lg border py-1.5 font-mono text-[10px] font-bold transition-all duration-150 ${
                      !available
                        ? "cursor-not-allowed border-neutral-900 bg-neutral-950 text-neutral-600 line-through"
                        : isSelected
                        ? "border-yellow-500 bg-yellow-500 text-neutral-950 shadow-md shadow-yellow-500/10"
                        : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-yellow-500/30 hover:text-yellow-400"
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

      {/* =========================
          DIVISOR DEL BOLETO
      ========================== */}

      <div className="relative z-10 flex h-6 w-full items-center justify-between bg-neutral-900">
        <div className="absolute -left-3 h-6 w-6 rounded-full bg-neutral-950" />

        <div className="mx-3 flex-1 border-b-2 border-dashed border-neutral-800/80" />

        <div className="absolute -right-3 h-6 w-6 rounded-full bg-neutral-950" />
      </div>

      {/* =========================
          TALÓN INFERIOR
      ========================== */}

      <div className="relative z-0 h-20 w-full">
        <AnimatePresence>
          {!isPeeling ? (
            <motion.div
              key="stub-button"
<<<<<<< Updated upstream
              initial={{ rotateX: 0, rotateY: 0, rotateZ: 0, skewX: 0, x: 0, y: 0, opacity: 1 }}
=======
              initial={{
                rotateX: 0,
                rotateY: 0,
                rotateZ: 0,
                x: 0,
                y: 0,
                opacity: 1,
              }}
>>>>>>> Stashed changes
              exit={{
                // Asymmetric multi-axis keyframes to simulate physical paper tearing and organic fluttering down
                rotateX: [0, 15, -30, -65],
                rotateY: [0, -10, 25, 45],
                rotateZ: [0, 12, 35, 60],
                skewX: [0, 15, -10, 0],
                x: [0, -10, -25, -45],
                y: [0, 15, 65, 180],
                opacity: [1, 1, 0.7, 0],
              }}
              transition={{
                duration: 1.1,
                times: [0, 0.25, 0.6, 1],
                ease: "easeInOut",
              }}
              style={{
                transformOrigin: "top right",
              }}
              className="absolute inset-0 flex w-full items-center justify-center overflow-hidden rounded-b-2xl border-x border-b border-neutral-800 bg-neutral-900 p-4 shadow-md"
            >
              <motion.div
                initial={{ opacity: 0 }}
                exit={{ opacity: 0.8 }}
                transition={{ duration: 0.3 }}
                className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/90 via-black/45 to-transparent"
              />

              <button
                type="button"
                onClick={handleBuy}
                disabled={!selectedTime}
                className={`relative z-10 w-full rounded-xl py-3 text-xs font-bold uppercase tracking-wider shadow-md transition-all duration-200 ${
                  !selectedTime
                    ? "cursor-not-allowed border border-neutral-900 bg-neutral-950 text-neutral-600"
                    : "bg-yellow-500 text-neutral-950 hover:bg-yellow-400 hover:shadow-lg hover:shadow-yellow-500/20 active:scale-95"
                }`}
              >
                {movie.status === "coming-soon"
                  ? "Precomprar Ticket"
                  : "Comprar Ticket"}
              </button>
            </motion.div>
          ) : (
<<<<<<< Updated upstream
            // motion.div (Stub confirmed): Vista final tras el desgarre
            // Muestra un código QR interactivo y las instrucciones de escaneo/revisión de correo.
            <motion.div
              key="stub-confirmed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="absolute inset-0 w-full bg-neutral-900/30 border-x border-b border-dashed border-neutral-800/80 rounded-b-2xl p-2.5 flex flex-col items-center justify-center gap-1.5"
            >
              {/* QR Code SVG: Vector estilizado con Finder Patterns en las esquinas */}
              <svg className="w-10 h-10 text-yellow-500/80 opacity-80" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 2h6v6H2V2zm1 1v4h4V3H3zm1 1h2v2H4V4zM16 2h6v6h-6V2zm1 1v4h4V3h-3zm1 1h2v2h-2V4zM2 16h6v6H2v-6zm1 1v4h4V3H3zm1 1h2v2H4v-2z" />
                <path d="M12 2h2v2h-2zm0 4h2v2h-2zm4 8h2v2h-2zm4 0h2v2h-2zm-8 4h2v2h-2zm4 4h2v2h-2zm-8-4h2v2H8zm4-8h2v2h-2zm8 4h2v2h-2z" />
                <path d="M10 10h2v2h-2zm2 2h2v2h-2zm-2 2h2v2h-2zm6-4h2v2h-2zm2 2h2v2h-2zm-4 4h2v2h-2z" />
              </svg>
              
              <div className="flex flex-col items-center text-center">
                <span className="text-[8px] font-bold text-neutral-200 uppercase tracking-widest leading-none">
                  TICKET COMPRADO • {selectedTime}
                </span>
                <span className="text-[7.5px] text-neutral-400 mt-1 max-w-[190px] leading-tight">
                  Escanea el código o revisa tu correo para ver tu boleto.
                </span>
              </div>
=======
            <motion.div
              key="stub-confirmed"
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                delay: 0.5,
                duration: 0.4,
              }}
              className="absolute inset-0 flex w-full flex-col items-center justify-center rounded-b-2xl border-x border-b border-dashed border-neutral-800/80 bg-neutral-900/30 p-3"
            >
              <div className="flex h-6 w-full items-center justify-center gap-0.5 opacity-65">
                <div className="h-full w-px bg-neutral-500" />
                <div className="h-full w-0.5 bg-neutral-500" />
                <div className="h-full w-px bg-neutral-500" />
                <div className="h-full w-1 bg-neutral-500" />
                <div className="h-full w-0.5 bg-neutral-500" />
                <div className="h-full w-px bg-neutral-500" />
                <div className="h-full w-0.5 bg-neutral-500" />
                <div className="h-full w-px bg-neutral-500" />
                <div className="h-full w-0.5 bg-neutral-500" />
                <div className="h-full w-1 bg-neutral-500" />
                <div className="h-full w-px bg-neutral-500" />
                <div className="h-full w-0.5 bg-neutral-500" />
                <div className="h-full w-px bg-neutral-500" />
                <div className="h-full w-0.5 bg-neutral-500" />
              </div>

              <span className="mt-1 text-[9px] font-mono uppercase tracking-widest text-neutral-500">
                TICKET COMPRADO • {selectedTime}
              </span>
>>>>>>> Stashed changes
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};