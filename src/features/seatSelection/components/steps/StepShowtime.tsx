// StepShowtime.tsx — Paso 1 del Stepper: Selección de Fecha, Cine, Formato, Idioma y Horario
// Utiliza Lucide React y mantiene la estética oscura/glassmorphism premium.

import React, { useEffect } from 'react';
import { Calendar, MapPin, Film, Languages, Clock, ChevronRight } from 'lucide-react';
import type { Movie } from '@/features/auth/pages/Home/data/movieData';

interface StepShowtimeProps {
  movie: Movie;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedTheater: string;
  setSelectedTheater: (theater: string) => void;
  selectedFormat: string;
  setSelectedFormat: (format: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  onNext: () => void;
}

const THEATERS = ['Multiplex Portal', 'Multiplex Titán', 'Multiplex Unicentro'];
const FORMATS = ['2D', '3D', 'IMAX'];
const LANGUAGES = ['Subtitulada', 'Doblada'];
const DATES = ['Hoy', 'Mañana', 'Sábado 22', 'Domingo 23', 'Lunes 24'];

const isTimePassed = (timeStr: string, dateStr: string): boolean => {
  if (dateStr !== 'Hoy') return false;
  const [hours, minutes] = timeStr.split(':').map(Number);
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();

  if (currentHours > hours) return true;
  if (currentHours === hours && currentMinutes >= minutes) return true;
  return false;
};

export const StepShowtime: React.FC<StepShowtimeProps> = ({
  movie,
  selectedDate,
  setSelectedDate,
  selectedTheater,
  setSelectedTheater,
  selectedFormat,
  setSelectedFormat,
  selectedLanguage,
  setSelectedLanguage,
  selectedTime,
  setSelectedTime,
  onNext,
}) => {
  // Limpia el horario seleccionado si el usuario cambia a "Hoy" y ese horario ya pasó
  useEffect(() => {
    if (selectedTime && isTimePassed(selectedTime, selectedDate)) {
      setSelectedTime('');
    }
  }, [selectedDate, selectedTime, setSelectedTime]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      {/* Panel izquierdo: Controles de selección */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-md">
        <h2 className="mb-6 text-lg font-bold text-neutral-100 uppercase tracking-wider font-sans">
          Detalles de tu función
        </h2>

        {/* 1. Selector de Fecha */}
        <div className="mb-6">
          <label className="mb-2.5 flex items-center gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            <Calendar className="h-4 w-4 text-yellow-500" /> Fecha
          </label>
          <div className="flex flex-wrap gap-2">
            {DATES.map((date) => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`rounded-xl border px-4 py-2 text-xs font-semibold transition-all duration-200 ${
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

        {/* 2. Selector de Complejo (Cine) */}
        <div className="mb-6">
          <label className="mb-2.5 flex items-center gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            <MapPin className="h-4 w-4 text-yellow-500" /> Complejo de Cine
          </label>
          <div className="grid gap-2.5 sm:grid-cols-3">
            {THEATERS.map((theater) => (
              <button
                key={theater}
                onClick={() => setSelectedTheater(theater)}
                className={`rounded-xl border p-3 text-left transition-all duration-200 ${
                  selectedTheater === theater
                    ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400'
                    : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                }`}
              >
                <p className="text-xs font-bold">{theater}</p>
                <p className="mt-1 text-[10px] text-neutral-500">CineMax Multicine</p>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Selector de Formato e Idioma */}
        <div className="mb-6 grid gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-2.5 flex items-center gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              <Film className="h-4 w-4 text-yellow-500" /> Formato
            </label>
            <div className="flex gap-2">
              {FORMATS.map((format) => (
                <button
                  key={format}
                  onClick={() => setSelectedFormat(format)}
                  className={`flex-1 rounded-xl border py-2 text-xs font-semibold transition-all duration-200 ${
                    selectedFormat === format
                      ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400'
                      : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                  }`}
                >
                  {format}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2.5 flex items-center gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              <Languages className="h-4 w-4 text-yellow-500" /> Idioma
            </label>
            <div className="flex gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`flex-1 rounded-xl border py-2 text-xs font-semibold transition-all duration-200 ${
                    selectedLanguage === lang
                      ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400'
                      : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Selector de Función (Showtimes) */}
        <div>
          <label className="mb-2.5 flex items-center gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            <Clock className="h-4 w-4 text-yellow-500" /> Horarios de Funciones
          </label>
          <div className="flex flex-wrap gap-2.5">
            {movie.showtimes.map((time) => {
              const disabled = isTimePassed(time, selectedDate);
              return (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  disabled={disabled}
                  className={`rounded-xl border px-5 py-3 text-xs font-mono font-bold transition-all duration-200 ${
                    disabled
                      ? 'border-neutral-900 bg-neutral-950/20 text-neutral-600 line-through cursor-not-allowed'
                      : selectedTime === time
                      ? 'border-yellow-500 bg-yellow-500 text-neutral-950 shadow-md shadow-yellow-500/15 cursor-pointer'
                      : 'border-neutral-800 bg-neutral-950/80 text-neutral-400 hover:border-yellow-500/30 hover:text-yellow-400 cursor-pointer'
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Panel derecho: Resumen visual de la película */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-md flex flex-col justify-between">
        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-yellow-500">Resumen de Selección</h3>
          <div className="flex gap-4 mb-5">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-16 rounded-xl object-cover aspect-[2/3] border border-neutral-800"
            />
            <div>
              <h4 className="text-sm font-bold text-neutral-100">{movie.title}</h4>
              <p className="text-[10px] text-neutral-400 mt-1 uppercase tracking-wider">{movie.duration} · {movie.genre}</p>
              <p className="text-[10px] text-yellow-400 mt-0.5 font-bold uppercase">★ Clasificación: {movie.rating}</p>
            </div>
          </div>

          <div className="border-t border-neutral-800/80 py-4 space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-400 font-medium">Complejo</span>
              <span className="text-neutral-200 font-semibold">{selectedTheater || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400 font-medium">Fecha</span>
              <span className="text-neutral-200 font-semibold">{selectedDate || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400 font-medium">Formato</span>
              <span className="text-neutral-200 font-semibold">{selectedFormat || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400 font-medium">Idioma</span>
              <span className="text-neutral-200 font-semibold">{selectedLanguage || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400 font-medium">Horario</span>
              <span className={`font-mono font-bold ${selectedTime ? 'text-yellow-400' : 'text-neutral-500'}`}>
                {selectedTime || '—'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onNext}
          disabled={!selectedTime || !selectedTheater || !selectedDate || !selectedFormat || !selectedLanguage}
          className={`w-full mt-6 flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
            selectedTime && selectedTheater && selectedDate && selectedFormat && selectedLanguage
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
