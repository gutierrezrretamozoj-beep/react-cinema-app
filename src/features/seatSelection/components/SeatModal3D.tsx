// SeatModal3D.tsx — Modal fullscreen con la sala de cine en 3D
// Diseño coherente con el proyecto: dark theme, glassmorphism, framer-motion.

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CinemaRoom3D } from './cinema3d/CinemaRoom3D';
import type { SeatData } from '../data/seatData';
import { ROWS_ORDER } from '../data/seatData';

interface SeatModal3DProps {
  isOpen: boolean;
  onClose: () => void;
  seats: SeatData[];
  selectedSeatIds: string[];
  onSeatToggle: (seat: SeatData) => void;
  movieTitle: string;
  movieTime: string;
  trailerUrl?: string;
}

const LEGEND = [
  { label: 'Estándar ($9.50)', color: 'bg-red-500' },
  { label: 'VIP ($14.50)', color: 'bg-yellow-500' },
  { label: 'Seleccionado', color: 'bg-emerald-500' },
  { label: 'Ocupado', color: 'bg-neutral-600' },
];

export const SeatModal3D = ({
  isOpen,
  onClose,
  seats,
  selectedSeatIds,
  onSeatToggle,
  movieTitle,
  movieTime,
  trailerUrl,
}: SeatModal3DProps) => {
  const [cameraMode, setCameraMode] = useState<'orbit' | 'seat'>(
    selectedSeatIds.length > 0 ? 'seat' : 'orbit'
  );
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [videoMuted, setVideoMuted] = useState(true);

  // El asiento activo para la cámara en modo seat: el último seleccionado
  const activeSeat = seats.find((s) => s.id === selectedSeatIds[selectedSeatIds.length - 1]) ?? null;

  const handleSeatClick = useCallback(
    (seat: SeatData) => {
      if (seat.status === 'occupied') return;
      onSeatToggle(seat);
      // Al seleccionar un asiento, cambia a vista desde butaca automáticamente
      if (!selectedSeatIds.includes(seat.id)) {
        setCameraMode('seat');
      }
    },
    [onSeatToggle, selectedSeatIds],
  );

  const handleToggleCameraMode = () => {
    if (cameraMode === 'orbit') {
      if (activeSeat || selectedSeatIds.length > 0) {
        setCameraMode('seat');
      }
    } else {
      setCameraMode('orbit');
    }
  };

  // URL del video: limpiar iframe embeds de YouTube a URL directa del archivo si es necesario
  const videoUrl = trailerUrl?.replace('embed/', 'watch?v=').split('?')[0] ?? '';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            key="modal-content"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex h-[95vh] w-[98vw] max-w-7xl flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 shadow-2xl"
          >
            {/* ── Header ───────────────────────────────────────────────── */}
            <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900/90 px-5 py-3 backdrop-blur-md">
              <div className="flex items-center gap-3">
                {/* Icono de sala 3D */}
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-500/10">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-yellow-400">
                    <path d="M11.644 1.59a.75.75 0 0 1 .712 0l9.75 5.25a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.712 0l-9.75-5.25a.75.75 0 0 1 0-1.32l9.75-5.25Z" />
                    <path d="m3.265 10.602 7.668 4.129a2.25 2.25 0 0 0 2.134 0l7.668-4.13 1.37.739a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.71 0l-9.75-5.25a.75.75 0 0 1 0-1.32l1.37-.738Z" />
                    <path d="m10.933 19.231-7.668-4.13-1.37.739a.75.75 0 0 0 0 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 0 0 0-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 0 1-2.134-.001Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-yellow-400 uppercase tracking-widest">Vista 3D de Sala</p>
                  <p className="text-[11px] text-neutral-400 leading-none mt-0.5">{movieTitle} · {movieTime}</p>
                </div>
              </div>

              {/* Controles del header */}
              <div className="flex items-center gap-2">
                {/* Toggle cámara */}
                <button
                  onClick={handleToggleCameraMode}
                  className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all ${
                    cameraMode === 'seat'
                      ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400'
                      : 'border-neutral-700 bg-neutral-800/60 text-neutral-300 hover:border-yellow-500/30 hover:text-yellow-400'
                  }`}
                  title={cameraMode === 'orbit' ? 'Vista desde butaca' : 'Vista orbital libre'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                    <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                  </svg>
                  {cameraMode === 'orbit' ? 'Desde Butaca' : 'Vista Libre'}
                </button>

                {/* Toggle video play/pause */}
                <button
                  onClick={() => setVideoPlaying((p) => !p)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800/60 text-neutral-300 transition hover:border-yellow-500/30 hover:text-yellow-400"
                  title={videoPlaying ? 'Pausar tráiler' : 'Reproducir tráiler'}
                >
                  {videoPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                      <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                      <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>

                {/* Toggle mute */}
                <button
                  onClick={() => setVideoMuted((m) => !m)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800/60 text-neutral-300 transition hover:border-yellow-500/30 hover:text-yellow-400"
                  title={videoMuted ? 'Activar sonido' : 'Silenciar'}
                >
                  {videoMuted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                      <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM17.78 9.22a.75.75 0 1 0-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L20.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-1.72 1.72-1.72-1.72Z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                      <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
                      <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" />
                    </svg>
                  )}
                </button>

                {/* Cerrar modal */}
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800/60 text-neutral-400 transition hover:border-red-500/30 hover:text-red-400"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* ── Cuerpo: Canvas 3D + Sidebar ──────────────────────────── */}
            <div className="flex flex-1 overflow-hidden">
              {/* Canvas 3D */}
              <div className="relative flex-1 overflow-hidden">
                <CinemaRoom3D
                  seats={seats}
                  selectedSeatIds={selectedSeatIds}
                  onSeatClick={handleSeatClick}
                  cameraMode={cameraMode}
                  activeSeatForCamera={activeSeat}
                  videoUrl={videoUrl}
                  videoPlaying={videoPlaying}
                  videoMuted={videoMuted}
                />

                {/* Hint de mouse-look (solo en modo seat) */}
                <AnimatePresence>
                  {cameraMode === 'seat' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-neutral-700/60 bg-neutral-900/70 px-4 py-1.5 text-[10px] text-neutral-400 backdrop-blur-md"
                    >
                      🖱️ Mantén clic y arrastra para mirar a tu alrededor
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Minimap 2D superpuesto en la esquina superior derecha del canvas */}
                <div className="absolute right-3 top-3 rounded-xl border border-neutral-700/60 bg-neutral-900/80 p-3 backdrop-blur-md">
                  <p className="mb-2 text-[8px] font-bold uppercase tracking-widest text-neutral-500">Plano de sala</p>
                  {/* Indicador de pantalla */}
                  <div className="mb-1.5 h-1.5 w-full rounded-sm bg-neutral-600/60 text-center" />
                  {/* Grid de mini asientos */}
                  <div className="grid gap-0.5" style={{ gridTemplateColumns: 'repeat(8, minmax(0, 1fr))' }}>
                    {ROWS_ORDER.flatMap((row) =>
                      Array.from({ length: 8 }, (_, cIdx) => {
                        const col = cIdx + 1;
                        const seat = seats.find((s) => s.row === row && s.col === col);
                        if (!seat) return null;
                        let cls = seat.type === 'vip' ? 'bg-yellow-500/70' : 'bg-red-500/70';
                        if (seat.status === 'occupied') cls = 'bg-neutral-600/70';
                        if (selectedSeatIds.includes(seat.id)) cls = 'bg-emerald-500 ring-1 ring-emerald-400/60';
                        return (
                          <button
                            key={seat.id}
                            className={`h-2 w-2 rounded-[2px] transition-all ${cls} ${seat.status === 'occupied' ? 'cursor-not-allowed' : 'cursor-pointer hover:brightness-125'}`}
                            onClick={() => handleSeatClick(seat)}
                            disabled={seat.status === 'occupied'}
                            title={`${seat.row}${seat.col} – ${seat.type === 'vip' ? 'VIP' : 'Estándar'} · $${seat.price}`}
                          />
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Leyenda en la esquina inferior izquierda */}
                <div className="absolute bottom-3 left-3 flex flex-col gap-1.5 rounded-xl border border-neutral-700/60 bg-neutral-900/80 p-3 backdrop-blur-md">
                  {LEGEND.map(({ label, color }) => (
                    <div key={label} className="flex items-center gap-2">
                      <div className={`h-2.5 w-2.5 rounded-[3px] ${color}`} />
                      <span className="text-[9px] text-neutral-400">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Sidebar: selección y confirmación ────────────────── */}
              <div className="flex w-64 flex-col border-l border-neutral-800 bg-neutral-900/80 backdrop-blur-md">
                <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Asientos seleccionados</h3>

                  {selectedSeatIds.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-950/60">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-neutral-600">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 0 1 21.75 8.25Z" />
                        </svg>
                      </div>
                      <p className="text-[11px] leading-relaxed text-neutral-500">
                        Haz clic en un asiento de la sala para seleccionarlo y ver la vista desde tu butaca
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {selectedSeatIds.map((seatId) => {
                        const seat = seats.find((s) => s.id === seatId);
                        if (!seat) return null;
                        return (
                          <motion.div
                            key={seatId}
                            layout
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950/60 px-3 py-2.5"
                          >
                            <div>
                              <p className="text-xs font-semibold text-neutral-100">
                                Fila {seat.row} · Asiento {seat.col}
                              </p>
                              <p className="text-[10px] text-neutral-400">
                                {seat.type === 'vip' ? '✨ VIP' : 'Estándar'} · ${seat.price.toFixed(2)}
                              </p>
                            </div>
                            <button
                              onClick={() => onSeatToggle(seat)}
                              className="flex h-6 w-6 items-center justify-center rounded-full text-neutral-600 transition hover:bg-red-500/10 hover:text-red-400"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-3.5 w-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer del sidebar: precio + botón */}
                <div className="border-t border-neutral-800 p-4">
                  {selectedSeatIds.length > 0 && (
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs text-neutral-400">Total ({selectedSeatIds.length} asiento{selectedSeatIds.length > 1 ? 's' : ''})</span>
                      <span className="text-sm font-bold text-yellow-400">
                        ${seats
                          .filter((s) => selectedSeatIds.includes(s.id))
                          .reduce((acc, s) => acc + s.price, 0)
                          .toFixed(2)}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={onClose}
                    className={`w-full rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
                      selectedSeatIds.length > 0
                        ? 'bg-yellow-500 text-neutral-950 hover:bg-yellow-400 active:scale-95'
                        : 'cursor-not-allowed border border-neutral-800 bg-neutral-950/60 text-neutral-600'
                    }`}
                    disabled={selectedSeatIds.length === 0}
                  >
                    {selectedSeatIds.length > 0 ? 'Confirmar Selección' : 'Selecciona un asiento'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SeatModal3D;
