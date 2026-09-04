// StepConfirmation.tsx — Paso 5 del Stepper: Boleto de Compra Exitoso y Código QR Dinámico
// Emplea un diseño físico de ticket premium con detalles dorados y código QR dinámico.

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, Ticket } from 'lucide-react';
import type { Movie } from '@/features/auth/pages/Home/data/movieData';

interface StepConfirmationProps {
  movie: Movie;
  selectedSeatsLabel: string;
  selectedDate: string;
  selectedTime: string;
  ticketCode: string;
  onGoHome: () => void;
  onGoToTickets: () => void;
}

export const StepConfirmation: React.FC<StepConfirmationProps> = ({
  movie,
  selectedSeatsLabel,
  selectedDate,
  selectedTime,
  ticketCode,
  onGoHome,
  onGoToTickets,
}) => {
  return (
    <div className="mx-auto max-w-md text-center py-4">
      {/* Animación del ícono de éxito */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="mb-4 flex justify-center"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <CheckCircle2 className="h-8 w-8" />
        </div>
      </motion.div>

      <h1 className="text-xl font-black text-neutral-100 uppercase tracking-tight flex items-center justify-center gap-1.5 font-sans">
        <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" /> ¡Reserva Exitosa!
      </h1>
      <p className="mt-2 text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
        Tu compra ha sido procesada correctamente. Presenta el código QR en la entrada de la sala.
      </p>

      {/* Ticket Físico de Cine */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="mt-8 mx-auto max-w-[19rem] rounded-2xl border border-yellow-500/30 bg-neutral-900 shadow-2xl shadow-yellow-500/5 relative overflow-hidden"
      >
        {/* Cabecera del ticket (Fondo de banner de película) */}
        <div className="relative h-36 w-full overflow-hidden">
          <img
            src={movie.backdropUrl || movie.posterUrl}
            alt=""
            className="h-full w-full object-cover brightness-[0.4]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-black/40" />
          
          <div className="absolute inset-0 flex flex-col justify-end p-4 text-left">
            <span className="font-mono text-[8px] text-yellow-500 font-bold uppercase tracking-widest">Entrada Digital</span>
            <h2 className="text-sm font-bold text-neutral-100 mt-1 line-clamp-1">{movie.title}</h2>
          </div>
        </div>

        {/* Ficha técnica */}
        <div className="p-5 text-left grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-[9px] text-neutral-500 font-bold uppercase">Fecha</span>
            <p className="font-semibold text-neutral-200 mt-0.5">{selectedDate}</p>
          </div>
          <div>
            <span className="text-[9px] text-neutral-500 font-bold uppercase">Hora</span>
            <p className="font-semibold text-neutral-200 mt-0.5">{selectedTime}</p>
          </div>
          <div>
            <span className="text-[9px] text-neutral-500 font-bold uppercase">Sala</span>
            <p className="font-semibold text-neutral-200 mt-0.5">IMAX Sala 3</p>
          </div>
          <div>
            <span className="text-[9px] text-neutral-500 font-bold uppercase">Asientos</span>
            <p className="font-semibold text-yellow-400 mt-0.5 truncate">{selectedSeatsLabel}</p>
          </div>
        </div>

        {/* Perforado del Ticket (Dashed separator) */}
        <div className="relative w-full h-6 bg-neutral-900 flex items-center justify-between z-10 overflow-visible">
          <div className="absolute -left-3 h-6 w-6 rounded-full bg-neutral-950 border-r border-neutral-800" />
          <div className="flex-1 border-b-2 border-dashed border-neutral-800/80 mx-3" />
          <div className="absolute -right-3 h-6 w-6 rounded-full bg-neutral-950 border-l border-neutral-800" />
        </div>

        {/* Sección inferior: QR + Código */}
        <div className="p-5 bg-neutral-900/50">
          {/* QR Code dinámico generado con rects */}
          <div className="w-24 h-24 bg-white rounded-xl p-2 mx-auto flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 100 100" width="80" height="80">
              {[...Array(10)].map((_, i) =>
                [...Array(10)].map((_, j) => {
                  // Genera un patrón QR pseudo-aleatorio consistente
                  const isBlack = (i + j) % 3 === 0 || (i * j) % 5 === 2 || (i === 0 || i === 9 || j === 0 || j === 9) && (i % 3 === 0 || j % 3 === 0);
                  return isBlack ? (
                    <rect key={`${i}${j}`} x={i * 10} y={j * 10} width={9.5} height={9.5} fill="#0a0a0c" />
                  ) : null;
                })
              )}
            </svg>
          </div>

          <p className="font-mono text-xs mt-4 text-neutral-300 uppercase tracking-widest">
            Código: <span className="font-bold text-yellow-400">{ticketCode}</span>
          </p>
        </div>
      </motion.div>

      {/* Botones */}
      <div className="mt-8 flex gap-3 justify-center">
        <button
          onClick={onGoHome}
          className="rounded-xl border border-neutral-800 bg-neutral-900/60 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:border-neutral-700 hover:text-neutral-100"
        >
          Ir al Inicio
        </button>
        <button
          onClick={onGoToTickets}
          className="rounded-xl bg-yellow-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-950 hover:bg-yellow-400 active:scale-95 shadow-lg shadow-yellow-500/10 flex items-center gap-1.5"
        >
          <Ticket className="h-4 w-4" /> Mis Boletas
        </button>
      </div>
    </div>
  );
};
