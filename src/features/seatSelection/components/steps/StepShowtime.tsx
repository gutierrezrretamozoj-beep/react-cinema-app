// StepShowtime.tsx — Paso 1 del Stepper: Selección de Fecha, Cine y Agrupación por Experiencia e Idioma
// Inspirado en la interfaz real de Multicine Viva Barranquilla.

import React from 'react';
import { Calendar, MapPin, Film, Sparkles, ChevronRight, Check } from 'lucide-react';
import type { Movie } from '@/features/auth/pages/Home/data/movieData';
import type { CinemaFunction } from '@/shared/api/cinemaApi';

interface StepShowtimeProps {
  movie: Movie;
  functionsList: CinemaFunction[];
  activeFunction: CinemaFunction | null;
  onSelectFunction: (fn: CinemaFunction) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedTheater: string;
  setSelectedTheater: (theater: string) => void;
  onNext: () => void;
}

const THEATERS = [
  'Multicine Viva Barranquilla',
  'Multiplex Buenavista',
  'Multiplex Portal',
];

const DATES = ['Hoy', 'Mañana', 'Sábado 22', 'Domingo 23', 'Lunes 24'];

const isTimePassed = (timeStr: string, dateStr: string): boolean => {
  if (dateStr !== 'Hoy') return false;
  
  // Normalizar formato "06:30 p. m." o "14:30"
  let clean = timeStr.replace(/\s+/g, ' ').trim().toLowerCase();
  let hours = 0;
  let minutes = 0;

  if (clean.includes('p. m.') || clean.includes('pm')) {
    const parts = clean.replace(/p\.?\s?m\.?/, '').trim().split(':');
    hours = (Number(parts[0]) % 12) + 12;
    minutes = Number(parts[1]) || 0;
  } else if (clean.includes('a. m.') || clean.includes('am')) {
    const parts = clean.replace(/a\.?\s?m\.?/, '').trim().split(':');
    hours = Number(parts[0]) % 12;
    minutes = Number(parts[1]) || 0;
  } else {
    const parts = clean.split(':');
    hours = Number(parts[0]) || 0;
    minutes = Number(parts[1]) || 0;
  }

  const now = new Date();
  if (now.getHours() > hours) return true;
  if (now.getHours() === hours && now.getMinutes() >= minutes) return true;
  return false;
};

export const StepShowtime: React.FC<StepShowtimeProps> = ({
  movie,
  functionsList,
  activeFunction,
  onSelectFunction,
  selectedDate,
  setSelectedDate,
  selectedTheater,
  setSelectedTheater,
  onNext,
}) => {
  // Filtrar las funciones disponibles para la fecha y el complejo seleccionados
  const availableFunctions = functionsList.filter(
    (fn) =>
      fn.movieId === movie.id &&
      (selectedDate ? fn.date === selectedDate : true) &&
      (selectedTheater ? fn.theater === selectedTheater : true)
  );

  // Agrupar funciones por experiencia / formato e idioma (ej. "4DX 2D - DOB", "Kids 2D - DOB", "IMAX 3D - SUB")
  const groupedExperiences = React.useMemo(() => {
    const groups: Record<string, { label: string; roomName: string; roomType: string; functions: CinemaFunction[] }> = {};

    availableFunctions.forEach((fn) => {
      const label = fn.experienceLabel || `${fn.format} - ${fn.language === 'Doblada' ? 'DOB' : 'SUB'}`;
      if (!groups[label]) {
        groups[label] = {
          label,
          roomName: fn.roomName,
          roomType: fn.roomType,
          functions: [],
        };
      }
      groups[label].functions.push(fn);
    });

    return Object.values(groups);
  }, [availableFunctions]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      {/* Panel izquierdo: Selección de Complejo, Fecha y Bloques de Funciones */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-md">
        <h2 className="mb-6 text-lg font-bold text-neutral-100 uppercase tracking-wider font-sans flex items-center justify-between">
          <span>Selecciona tu Función</span>
          <span className="text-[10px] font-mono font-normal text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-1 rounded-full">
            Salas Independientes
          </span>
        </h2>

        {/* 1. Selector de Complejo de Cine */}
        <div className="mb-6">
          <label className="mb-2.5 flex items-center gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            <MapPin className="h-4 w-4 text-yellow-500" /> Complejo de Cine
          </label>
          <div className="grid gap-2.5 sm:grid-cols-3">
            {THEATERS.map((theater) => (
              <button
                key={theater}
                onClick={() => setSelectedTheater(theater)}
                className={`rounded-xl border p-3 text-left transition-all duration-200 cursor-pointer ${
                  selectedTheater === theater
                    ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400 shadow-md shadow-yellow-500/5'
                    : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                }`}
              >
                <p className="text-xs font-bold truncate">{theater}</p>
                <p className="mt-1 text-[10px] text-neutral-500">Multicine Digital</p>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Selector de Fecha */}
        <div className="mb-6">
          <label className="mb-2.5 flex items-center gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            <Calendar className="h-4 w-4 text-yellow-500" /> Fecha
          </label>
          <div className="flex flex-wrap gap-2">
            {DATES.map((date) => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`rounded-xl border px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  selectedDate === date
                    ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400'
                    : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                }`}
              >
                {date}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Horarios Agrupados por Experiencia / Formato (Referencia Viva Barranquilla) */}
        <div>
          <label className="mb-3.5 flex items-center gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            <Film className="h-4 w-4 text-yellow-500" /> Experiencias y Horarios Disponibles
          </label>

          {groupedExperiences.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-800 p-8 text-center bg-neutral-950/40">
              <p className="text-sm font-semibold text-neutral-400">No hay funciones disponibles para esta fecha y cine.</p>
              <p className="text-xs text-neutral-600 mt-1">Prueba seleccionando otro complejo o fecha.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {groupedExperiences.map((group) => (
                <div
                  key={group.label}
                  className="rounded-xl border border-neutral-800/80 bg-neutral-950/50 p-4 transition-all hover:border-neutral-700/80"
                >
                  {/* Encabezado del formato e info de sala */}
                  <div className="flex items-center justify-between border-b border-neutral-800/60 pb-2.5 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-100 tracking-wide">
                        {group.label}
                      </span>
                      {group.roomType === 'imax' && (
                        <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase text-indigo-300 border border-indigo-500/30">
                          Gran Sala 80 Asientos
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {group.roomName}
                    </span>
                  </div>

                  {/* Píldoras de Horarios */}
                  <div className="flex flex-wrap gap-2.5">
                    {group.functions.map((fn) => {
                      const isPassed = isTimePassed(fn.time, selectedDate);
                      const isSelected = activeFunction?.id === fn.id;

                      return (
                        <button
                          key={fn.id}
                          onClick={() => !isPassed && onSelectFunction(fn)}
                          disabled={isPassed}
                          className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-mono font-bold transition-all duration-200 cursor-pointer ${
                            isPassed
                              ? 'border-neutral-900 bg-neutral-950/30 text-neutral-600 line-through cursor-not-allowed opacity-50'
                              : isSelected
                              ? 'border-yellow-500 bg-yellow-500 text-neutral-950 shadow-md shadow-yellow-500/20'
                              : 'border-neutral-800 bg-neutral-900/90 text-neutral-300 hover:border-yellow-500/40 hover:text-yellow-400'
                          }`}
                        >
                          {isSelected && <Check className="h-3.5 w-3.5 stroke-3" />}
                          <span>{fn.time}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Panel derecho: Resumen de la Función Seleccionada */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-md flex flex-col justify-between">
        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-yellow-500 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> Resumen de Selección
          </h3>
          <div className="flex gap-4 mb-5">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-16 rounded-xl object-cover aspect-2/3 border border-neutral-800 shadow-md"
            />
            <div>
              <h4 className="text-sm font-bold text-neutral-100 line-clamp-1">{movie.title}</h4>
              <p className="text-[10px] text-neutral-400 mt-1 uppercase tracking-wider">{movie.duration} · {movie.genre}</p>
              <p className="text-[10px] text-yellow-400 mt-1 font-bold uppercase">★ Clasificación: {movie.rating}</p>
            </div>
          </div>

          <div className="border-t border-neutral-800/80 py-4 space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-400 font-medium">Complejo</span>
              <span className="text-neutral-200 font-semibold truncate max-w-44 text-right">
                {activeFunction ? activeFunction.theater : selectedTheater || '—'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400 font-medium">Fecha</span>
              <span className="text-neutral-200 font-semibold">
                {activeFunction ? activeFunction.date : selectedDate || '—'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400 font-medium">Sala y Experiencia</span>
              <span className="text-neutral-200 font-semibold">
                {activeFunction ? `${activeFunction.roomName} (${activeFunction.format})` : '—'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400 font-medium">Idioma</span>
              <span className="text-neutral-200 font-semibold">
                {activeFunction ? activeFunction.language : '—'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400 font-medium">Capacidad de Sala</span>
              <span className="text-yellow-400 font-mono font-bold">
                {activeFunction ? `${(activeFunction.rows?.length || 6) * (activeFunction.cols || 8)} asientos` : '—'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400 font-medium">Horario</span>
              <span className={`font-mono font-bold ${activeFunction?.time ? 'text-yellow-400 text-sm' : 'text-neutral-500'}`}>
                {activeFunction?.time || '—'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onNext}
          disabled={!activeFunction}
          className={`w-full mt-6 flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            activeFunction
              ? 'bg-yellow-500 text-neutral-950 hover:bg-yellow-400 active:scale-95 shadow-lg shadow-yellow-500/10'
              : 'cursor-not-allowed border border-neutral-800 bg-neutral-950/40 text-neutral-600'
          }`}
        >
          Elegir Asientos <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
