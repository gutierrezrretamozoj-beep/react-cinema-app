import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Armchair, Compass, ChevronRight, Accessibility, Volume2, VolumeX, Sparkles, AlertCircle } from 'lucide-react';
import type { SeatData } from '../../data/seatData';
import { checkOrphanSeats } from '../../data/seatData';
import { sfx } from '../../utils/soundEffects';
import { SeatModal3D } from '../SeatModal3D';
import type { Movie } from '@/features/auth/pages/Home/data/movieData';
import type { CinemaFunction } from '@/shared/api/cinemaApi';

interface StepSeatsProps {
  movie: Movie;
  seats: SeatData[];
  activeFunction?: CinemaFunction | null;
  selectedSeatIds: string[];
  onSeatToggle: (seat: SeatData) => void;
  selectedDate: string;
  selectedTheater: string;
  selectedTime: string;
  timeLeft?: number;
  timerExpired: boolean;
  onNextSnacks: () => void;
  onNextPayment: () => void;
  onBack: () => void;
}

export const StepSeats: React.FC<StepSeatsProps> = ({
  movie,
  seats,
  activeFunction,
  selectedSeatIds,
  onSeatToggle,
  selectedDate,
  selectedTheater,
  selectedTime,
  timerExpired,
  onNextSnacks,
  onNextPayment,
  onBack,
}) => {
  const [is3DOpen, setIs3DOpen] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const [isDesktop, setIsDesktop] = useState(true);
  const [soundOn, setSoundOn] = useState(() => sfx.enabled);
  const [orphanWarning, setOrphanWarning] = useState<string | null>(null);

  // Determinar filas y columnas a partir de la función activa o los asientos
  const { roomRows, roomCols, roomName, isImax } = React.useMemo(() => {
    if (activeFunction) {
      return {
        roomRows: activeFunction.rows || ['A', 'B', 'C', 'D', 'E', 'F'],
        roomCols: activeFunction.cols || 8,
        roomName: activeFunction.roomName || 'Sala Estándar',
        isImax: activeFunction.roomType === 'imax',
      };
    }
    const uniqueRows = Array.from(new Set(seats.map((s) => s.row)));
    const maxCol = Math.max(...seats.map((s) => s.col), 8);
    return {
      roomRows: uniqueRows.length > 0 ? uniqueRows : ['A', 'B', 'C', 'D', 'E', 'F'],
      roomCols: maxCol,
      roomName: 'Sala de Cine',
      isImax: uniqueRows.length > 6 || maxCol > 8,
    };
  }, [activeFunction, seats]);

  // Estados del toast informativo de la vista 3D
  const [show3DToast, setShow3DToast] = useState(false);
  const [toastShown, setToastShown] = useState(false);

  // Verificación de compatibilidad con WebGL y tamaño de pantalla
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const support = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
      setWebglSupported(support);
    } catch {
      setWebglSupported(false);
    }

    const checkSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const is3DEnabled = webglSupported && isDesktop;

  // Lógica del toast informativo
  useEffect(() => {
    if (selectedSeatIds.length === 1 && !toastShown && is3DEnabled) {
      setShow3DToast(true);
      setToastShown(true);
      const timer = setTimeout(() => setShow3DToast(false), 3000);
      return () => clearTimeout(timer);
    }
    if (selectedSeatIds.length === 0) {
      setToastShown(false);
    }
  }, [selectedSeatIds, toastShown, is3DEnabled]);

  // Manejador inteligente de click en asiento con prevención de asiento huérfano y SFX
  const handleSeatClick = (seat: SeatData) => {
    if (timerExpired || seat.status === 'occupied') return;

    const isCurrentlySelected = selectedSeatIds.includes(seat.id);

    if (isCurrentlySelected) {
      sfx.playSeatDeselect();
      setOrphanWarning(null);
      onSeatToggle(seat);
      return;
    }

    // Comprobación de regla de asiento huérfano (Single Orphan Seat Gap Rule)
    const tentativeIds = [...selectedSeatIds, seat.id];
    const orphanResult = checkOrphanSeats(tentativeIds, seats, roomRows, roomCols);

    if (orphanResult.hasOrphan) {
      sfx.playWarning();
      setOrphanWarning(
        `Aviso de aforo: La selección deja una butaca individual libre (${orphanResult.orphanSeatId}). Intenta seleccionar asientos continuos.`
      );
    } else {
      setOrphanWarning(null);
      sfx.playSeatSelect();
    }

    onSeatToggle(seat);
  };

  // Valores agregados del pedido
  const selectedSeatsList = seats.filter((s) => selectedSeatIds.includes(s.id));
  const vipCount = selectedSeatsList.filter((s) => s.type === 'vip').length;
  const accessibleCount = selectedSeatsList.filter((s) => s.type === 'accessible').length;
  const standardCount = selectedSeatIds.length - vipCount - accessibleCount;
  const ticketsTotal = selectedSeatsList.reduce((acc, s) => acc + s.price, 0);
  const creditsToEarn = Math.round(ticketsTotal * 10);

  // Clases visuales de las butacas 2D físicas
  const getSeat2DClass = (seat: SeatData, isSelected: boolean): string => {
    if (seat.status === 'occupied') {
      return 'bg-neutral-800/80 border-neutral-700 text-neutral-600 cursor-not-allowed opacity-35';
    }
    if (isSelected) {
      return 'bg-emerald-500 border-emerald-400 text-neutral-950 shadow-md shadow-emerald-500/20 scale-105';
    }
    if (seat.type === 'accessible') {
      return 'bg-cyan-500/15 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/25 hover:border-cyan-400';
    }
    if (seat.type === 'vip') {
      return 'bg-yellow-500/15 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/25 hover:border-yellow-400';
    }
    return 'bg-neutral-800/60 border-neutral-700 text-neutral-300 hover:bg-neutral-700/60 hover:border-neutral-500';
  };

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch animate-fade-in">
      
      {/* Panel izquierdo: Resumen del Pedido con forma de tiquete */}
      <div className="flex flex-col w-full lg:w-76 shrink-0 rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden backdrop-blur-md justify-between">
        
        {/* Cuerpo superior del tiquete: Detalles de la película */}
        <div className="p-5">
          <div className="relative h-32 w-full overflow-hidden rounded-xl border border-neutral-800 mb-4">
            <img
              src={movie.backdropUrl || movie.posterUrl}
              alt=""
              className="h-full w-full object-cover brightness-[0.55]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 to-transparent" />
            <div className="absolute inset-x-3 bottom-2">
              <span className="font-mono text-[8px] text-yellow-500 font-bold uppercase tracking-widest">Resumen</span>
              <h3 className="text-xs font-bold text-neutral-100 mt-0.5 line-clamp-1">{movie.title}</h3>
            </div>
          </div>

          <div className="space-y-2.5 text-[11px] text-neutral-400">
            <div className="flex justify-between">
              <span className="font-medium text-neutral-500">TEATRO</span>
              <span className="font-semibold text-neutral-200 truncate max-w-44">{selectedTheater}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-neutral-500">FECHA Y HORA</span>
              <span className="font-semibold text-neutral-200">{selectedDate} · {selectedTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-neutral-500">FORMATO</span>
              <span className="font-semibold text-neutral-200">{movie.formats?.[0] || 'IMAX'}</span>
            </div>
          </div>
        </div>

        {/* Divisor con notches laterales (Forma de tiquete) */}
        <div className="relative w-full h-6 bg-neutral-955 flex items-center justify-between z-10 overflow-visible border-y border-neutral-900/50">
          <div className="absolute -left-3 h-6 w-6 rounded-full bg-neutral-950 border-r border-neutral-800/40 z-20" />
          <div className="flex-1 border-b border-dashed border-neutral-800/80 mx-3" />
          <div className="absolute -right-3 h-6 w-6 rounded-full bg-neutral-950 border-l border-neutral-800/40 z-20" />
        </div>

        {/* Colilla inferior (Stub): Selección de butacas, total y botones */}
        <div className="p-5 bg-neutral-950/20">
          <h4 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-yellow-500">Sillas Seleccionadas</h4>
          
          {selectedSeatIds.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center gap-1.5 border border-dashed border-neutral-800/60 rounded-xl bg-neutral-950/30">
              <Armchair className="h-6 w-6 text-neutral-600 animate-pulse" />
              <p className="text-[10px] text-neutral-500 max-w-[160px] leading-relaxed">Selecciona tus sillas en el mapa</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Asientos seleccionados */}
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                {selectedSeatsList.map((s) => (
                  <span
                    key={s.id}
                    className={`rounded-md border px-2 py-0.5 text-[9px] font-mono font-bold flex items-center gap-1 ${
                      s.type === 'vip'
                        ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'
                        : s.type === 'accessible'
                        ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400'
                        : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                    }`}
                  >
                    {s.type === 'accessible' && <Accessibility className="h-2.5 w-2.5" />}
                    {s.id} {s.type === 'vip' ? '✦' : ''}
                  </span>
                ))}
              </div>

              {/* Botón de vista 3D Condicionado */}
              {is3DEnabled ? (
                <div className="relative w-full">
                  <AnimatePresence>
                    {show3DToast && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, x: '-50%', scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
                        exit={{ opacity: 0, y: 10, x: '-50%', scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                        className="absolute bottom-full left-1/2 mb-2 z-30 bg-neutral-900 border border-yellow-500/40 p-2.5 pr-7 rounded-xl text-[10px] text-yellow-400 font-bold text-center shadow-2xl w-56 select-none"
                      >
                        💡 ¡Explora tus asientos elegidos en 3D haciendo clic abajo!
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShow3DToast(false);
                          }}
                          className="absolute top-1.5 right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-neutral-850 text-[7px] text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition-colors cursor-pointer"
                        >
                          ✕
                        </button>
                        <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-neutral-900 border-r border-b border-yellow-500/40 rotate-45" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <button
                    onClick={() => setIs3DOpen(true)}
                    disabled={timerExpired}
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-yellow-500/20 bg-yellow-500/5 py-2 text-[11px] font-semibold text-yellow-400 transition-all hover:border-yellow-500/40 hover:bg-yellow-500/10 cursor-pointer"
                  >
                    <Compass className="h-3.5 w-3.5" /> Explorar sala en 3D
                  </button>
                </div>
              ) : (
                <div className="rounded-lg border border-neutral-800/80 bg-neutral-950/60 p-2 text-center text-[9px] text-neutral-500">
                  <span className="block font-bold text-neutral-400 mb-0.5">Experiencia 3D No Disponible</span>
                  Requiere WebGL y pantalla de 1024px o superior (Ordenador).
                </div>
              )}

              <div className="border-t border-neutral-800/80 pt-3 space-y-1.5 text-[11px]">
                {standardCount > 0 && (
                  <div className="flex justify-between text-neutral-400">
                    <span>General × {standardCount}</span>
                    <span className="text-neutral-200">${(standardCount * 9.5).toFixed(2)}</span>
                  </div>
                )}
                {vipCount > 0 && (
                  <div className="flex justify-between text-neutral-400">
                    <span>VIP × {vipCount}</span>
                    <span className="text-yellow-400">${(vipCount * 14.5).toFixed(2)}</span>
                  </div>
                )}
                {accessibleCount > 0 && (
                  <div className="flex justify-between text-cyan-400">
                    <span className="flex items-center gap-1">
                      <Accessibility className="h-3 w-3" /> Accesible × {accessibleCount}
                    </span>
                    <span>${(accessibleCount * 8.5).toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-neutral-800/80 pt-3 flex items-center justify-between text-xs font-bold text-yellow-500">
                <span>TOTAL</span>
                <span>${ticketsTotal.toFixed(2)}</span>
              </div>

              {/* Puntos de fidelidad Nova Credits */}
              <div className="mt-2.5 flex items-center gap-2 rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-2.5 py-1.5">
                <Sparkles className="h-3.5 w-3.5 text-yellow-400 shrink-0 animate-pulse" />
                <p className="text-[9.5px] text-neutral-300 leading-tight">
                  Ganas <span className="font-bold text-yellow-400">+{creditsToEarn} Nova Credits</span> con esta reserva
                </p>
              </div>
            </div>
          )}

          {/* Botones duales de Checkout */}
          <div className="mt-5 flex flex-col gap-2">
            <button
              onClick={() => {
                sfx.playStepTransition();
                onNextSnacks();
              }}
              disabled={selectedSeatIds.length === 0 || timerExpired}
              className={`w-full flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                selectedSeatIds.length > 0 && !timerExpired
                  ? 'bg-yellow-500 text-neutral-950 hover:bg-yellow-400 active:scale-95 shadow-lg shadow-yellow-500/10'
                  : 'cursor-not-allowed border border-neutral-800 bg-neutral-950/40 text-neutral-600'
              }`}
            >
              Agregar Snacks 🍿 <ChevronRight className="h-3.5 w-3.5" />
            </button>
            
            <button
              onClick={() => {
                sfx.playStepTransition();
                onNextPayment();
              }}
              disabled={selectedSeatIds.length === 0 || timerExpired}
              className={`w-full flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                selectedSeatIds.length > 0 && !timerExpired
                  ? 'border border-emerald-500/40 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10 active:scale-95'
                  : 'cursor-not-allowed border border-neutral-800 bg-neutral-950/40 text-neutral-600'
              }`}
            >
              Omitir e Ir al Pago 💳
            </button>

            <button
              onClick={onBack}
              className="w-full text-center text-[10px] text-neutral-500 hover:text-neutral-300 mt-2 py-1 transition-colors font-medium cursor-pointer"
            >
              ← Volver a Horarios
            </button>
          </div>
        </div>
      </div>

      {/* Panel derecho: Mapa 2D de Asientos */}
      <div className="flex flex-1 flex-col items-center gap-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-md relative overflow-hidden">
        
        {/* Encabezado de la Sala con Control SFX */}
        <div className="flex w-full items-center justify-between border-b border-neutral-800/60 pb-4">
          <div>
            <h2 className="text-sm font-bold text-neutral-100 uppercase tracking-wider">Distribución de la Sala</h2>
            <p className="text-[10px] text-neutral-400 mt-1 uppercase tracking-wider">
              {selectedTheater} · <span className="text-yellow-400 font-semibold">{roomName}</span> ({seats.length} asientos)
            </p>
          </div>

          {/* Toggle de Efectos de Sonido Web Audio */}
          <button
            onClick={() => setSoundOn(sfx.toggleMute())}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-700/80 bg-neutral-800/50 px-2.5 py-1 text-[10px] font-semibold text-neutral-300 hover:border-yellow-500/40 hover:text-yellow-400 transition-colors cursor-pointer"
            title={soundOn ? 'Desactivar efectos de sonido' : 'Activar efectos de sonido'}
          >
            {soundOn ? <Volume2 className="h-3 w-3 text-yellow-500" /> : <VolumeX className="h-3 w-3 text-neutral-500" />}
            <span>{soundOn ? 'SFX ON' : 'SFX OFF'}</span>
          </button>
        </div>

        {/* Alerta de Prevención de Asiento Huérfano */}
        <AnimatePresence>
          {orphanWarning && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              className="w-full max-w-lg -mb-2 flex items-center justify-between gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3.5 py-2 text-[11px] text-amber-300 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-400 animate-pulse" />
                <span className="leading-snug">{orphanWarning}</span>
              </div>
              <button
                onClick={() => setOrphanWarning(null)}
                className="text-amber-400 hover:text-amber-200 text-xs px-1.5 py-0.5 rounded-md hover:bg-amber-500/20 cursor-pointer transition-colors"
                title="Cerrar aviso"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pantalla Curvada con Resplandor (Glow) */}
        <div className="relative w-full max-w-lg mt-2 mb-8 flex flex-col items-center">
          <div 
            className="absolute top-[-36px] left-1/2 -translate-x-1/2 h-16 w-[70%] blur-[28px] pointer-events-none opacity-60 rounded-full"
            style={{
              background: isImax
                ? 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.5) 0%, rgba(234, 179, 8, 0.25) 60%, transparent 100%)'
                : 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.45) 0%, rgba(234, 179, 8, 0.2) 60%, transparent 100%)'
            }}
          />
          <div className="h-1.5 w-[85%] rounded-full screen-bar-glow" />
          <span className="text-[9px] font-mono tracking-[0.45em] text-neutral-500 text-center uppercase mt-3">
            {isImax ? 'PANTALLA GIGANTE IMAX' : 'PANTALLA DIGITAL'}
          </span>
        </div>

        {/* Grilla física 2D de Asientos Dinámica */}
        <div className="flex flex-col gap-2 w-full max-w-lg my-2 overflow-x-auto pb-2">
          {roomRows.map((row) => (
            <div key={row} className="flex items-center justify-center gap-1.5">
              <span className="w-4 shrink-0 text-center text-[10px] font-mono font-bold text-neutral-500">{row}</span>
              <div className="flex justify-center gap-1.5">
                {Array.from({ length: roomCols }, (_, cIdx) => {
                  const col = cIdx + 1;
                  const seat = seats.find((s) => s.row === row && s.col === col);
                  if (!seat) return null;
                  const isSelected = selectedSeatIds.includes(seat.id);
                  const isAisle = col === Math.floor(roomCols / 2) + 1;

                  return (
                    <React.Fragment key={seat.id}>
                      {isAisle && <div className="w-3 shrink-0" />} {/* Pasillo central dinámico */}
                      <button
                        onClick={() => handleSeatClick(seat)}
                        disabled={seat.status === 'occupied' || timerExpired}
                        className={`seat-physical flex h-7 w-7 sm:h-7.5 sm:w-7.5 items-center justify-center border text-[9px] font-mono font-bold transition-all duration-150 ${getSeat2DClass(seat, isSelected)}`}
                        title={`${seat.id} · ${seat.type === 'vip' ? 'VIP' : seat.type === 'accessible' ? 'Accesible' : 'Estándar'} · $${seat.price}`}
                      >
                        {seat.type === 'accessible' ? (
                          <Accessibility className="h-3.5 w-3.5" />
                        ) : (
                          col
                        )}
                      </button>
                    </React.Fragment>
                  );
                })}
              </div>
              <span className="w-4 shrink-0 text-center text-[10px] font-mono font-bold text-neutral-500">{row}</span>
            </div>
          ))}
        </div>

        {/* Leyenda con Accesibilidad */}
        <div className="mt-4 flex flex-wrap justify-center gap-4 border-t border-neutral-800/50 pt-4 w-full">
          {[
            { label: 'Disponible', cls: 'bg-neutral-800/60 border-neutral-700' },
            { label: 'VIP ($14.50)', cls: 'bg-yellow-500/15 border-yellow-500/50 text-yellow-400' },
            { label: 'Accesible ($8.50)', cls: 'bg-cyan-500/15 border-cyan-500/50 text-cyan-400', isIcon: true },
            { label: 'Seleccionado', cls: 'bg-emerald-500 border-emerald-400' },
            { label: 'Ocupado', cls: 'bg-neutral-800/80 border-neutral-700 opacity-35' },
          ].map(({ label, cls, isIcon }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`h-4 w-4 rounded-[4px] border ${cls} seat-physical flex items-center justify-center`}>
                {isIcon && <Accessibility className="h-2.5 w-2.5" />}
              </div>
              <span className="text-[10px] text-neutral-400">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal 3D Sincronizado */}
      <SeatModal3D
        isOpen={is3DOpen}
        onClose={() => setIs3DOpen(false)}
        seats={seats}
        selectedSeatIds={selectedSeatIds}
        onSeatToggle={onSeatToggle}
        movieTitle={movie.title}
        movieTime={selectedTime}
        trailerUrl={movie.trailerUrl}
      />

    </div>
  );
};
export default StepSeats;
