// StepSnacks.tsx — Paso 3 del Stepper: Confitería y Selección de Snacks
// Emplea íconos premium de Lucide React y un diseño de confitería de alta gama.

import React from 'react';
import { Popcorn, CupSoda, Triangle, Sandwich, Candy, Droplet, Plus, Minus, ChevronRight } from 'lucide-react';
import type { Movie } from '@/features/auth/pages/Home/data/movieData';

interface SnackItem {
  id: string;
  name: string;
  price: number;
  icon: React.ReactNode;
}

interface StepSnacksProps {
  movie: Movie;
  selectedSeatsCount: number;
  ticketsTotal: number;
  snacks: Record<string, number>;
  onSnackQtyChange: (id: string, qty: number) => void;
  selectedDate: string;
  selectedTime: string;
  onNext: () => void;
  onBack: () => void;
}

const SNACKS_CATALOG: SnackItem[] = [
  { id: 'pop-m',  name: 'Crispetas Medianas', price: 6.50,  icon: <Popcorn className="h-8 w-8 text-yellow-500" /> },
  { id: 'pop-l',  name: 'Crispetas Grandes',  price: 8.00,  icon: <Popcorn className="h-9 w-9 text-yellow-500" /> },
  { id: 'soda-m', name: 'Gaseosa Mediana',    price: 3.50,  icon: <CupSoda className="h-8 w-8 text-blue-400" /> },
  { id: 'soda-l', name: 'Gaseosa Grande',     price: 4.80,  icon: <CupSoda className="h-9 w-9 text-blue-400" /> },
  { id: 'nachos', name: 'Nachos con Queso',   price: 5.50,  icon: <Triangle className="h-8 w-8 text-yellow-600 fill-yellow-600/10" /> },
  { id: 'hotdog', name: 'Hot Dog Especial',   price: 6.00,  icon: <Sandwich className="h-8 w-8 text-amber-600" /> },
  { id: 'candy',  name: 'Dulces Surtidos',    price: 3.00,  icon: <Candy className="h-8 w-8 text-pink-400" /> },
  { id: 'water',  name: 'Agua Embotellada',   price: 2.20,  icon: <Droplet className="h-8 w-8 text-cyan-400" /> },
];

export const StepSnacks: React.FC<StepSnacksProps> = ({
  movie,
  selectedSeatsCount,
  ticketsTotal,
  snacks,
  onSnackQtyChange,
  selectedDate,
  selectedTime,
  onNext,
  onBack,
}) => {
  
  const handleIncrease = (id: string) => {
    const current = snacks[id] ?? 0;
    if (current < 5) onSnackQtyChange(id, current + 1);
  };

  const handleDecrease = (id: string) => {
    const current = snacks[id] ?? 0;
    if (current > 0) onSnackQtyChange(id, current - 1);
  };

  // Cálculo de totales
  const snacksTotal = Object.entries(snacks).reduce((acc, [id, qty]) => {
    const price = SNACKS_CATALOG.find((s) => s.id === id)?.price ?? 0;
    return acc + price * qty;
  }, 0);

  const grandTotal = ticketsTotal + snacksTotal;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      
      {/* Panel izquierdo: Catálogo de confitería */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-md">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-neutral-100 uppercase tracking-wider">Confitería CineMax</h2>
          <p className="text-xs text-neutral-400 mt-1">Acompaña tu película con nuestros mejores combos. ¡Pide en línea y evita filas!</p>
        </div>

        {/* Grid de confitería */}
        <div className="grid gap-4 sm:grid-cols-2">
          {SNACKS_CATALOG.map((item) => {
            const qty = snacks[item.id] ?? 0;
            return (
              <div
                key={item.id}
                className={`relative flex items-center justify-between rounded-2xl border p-4 transition-all duration-200 ${
                  qty > 0
                    ? 'border-yellow-500/50 bg-yellow-500/5 shadow-md shadow-yellow-500/5'
                    : 'border-neutral-800 bg-neutral-950/40 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-neutral-900/90 border border-neutral-800">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-200">{item.name}</h4>
                    <p className="text-[11px] font-mono text-yellow-400 font-bold mt-1">${item.price.toFixed(2)}</p>
                  </div>
                </div>

                {/* Controles de cantidad */}
                <div className="flex items-center gap-2 bg-neutral-900/80 border border-neutral-800 rounded-xl px-2 py-1">
                  <button
                    onClick={() => handleDecrease(item.id)}
                    disabled={qty === 0}
                    className={`flex h-5 w-5 items-center justify-center rounded-lg transition-colors ${
                      qty > 0 ? 'text-neutral-300 hover:bg-neutral-800' : 'text-neutral-600 cursor-not-allowed'
                    }`}
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-5 text-center text-xs font-mono font-bold text-neutral-100">{qty}</span>
                  <button
                    onClick={() => handleIncrease(item.id)}
                    disabled={qty >= 5}
                    className={`flex h-5 w-5 items-center justify-center rounded-lg transition-colors ${
                      qty < 5 ? 'text-neutral-300 hover:bg-neutral-800' : 'text-neutral-600 cursor-not-allowed'
                    }`}
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Panel derecho: Resumen consolidado del pedido con formato de tiquete consistente */}
      <div className="flex flex-col w-full lg:w-76 shrink-0 rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden backdrop-blur-md justify-between">
        
        {/* Cuerpo superior del tiquete: Detalles de la película */}
        <div className="p-5">
          <div className="relative h-32 w-full overflow-hidden rounded-xl border border-neutral-800 mb-4">
            <img
              src={movie.backdropUrl || movie.posterUrl}
              alt=""
              className="h-full w-full object-cover brightness-[0.55]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-neutral-900/90 to-transparent" />
            <div className="absolute inset-x-3 bottom-2">
              <span className="font-mono text-[8px] text-yellow-500 font-bold uppercase tracking-widest">Resumen</span>
              <h3 className="text-xs font-bold text-neutral-100 mt-0.5 line-clamp-1">{movie.title}</h3>
            </div>
          </div>

          <div className="space-y-2.5 text-[11px] text-neutral-400">
            <div className="flex justify-between">
              <span className="font-medium text-neutral-500">TEATRO</span>
              <span className="font-semibold text-neutral-200 truncate max-w-44">Multiplex Portal</span>
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

        {/* Colilla inferior (Stub): Snacks seleccionados, total y botones */}
        <div className="p-5 bg-neutral-950/20">
          <h4 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-yellow-500">Resumen de Compra</h4>

          <div className="space-y-3 text-xs border-b border-neutral-850/60 pb-3">
            <div className="flex justify-between text-neutral-400">
              <span>Entradas ({selectedSeatsCount})</span>
              <span className="text-neutral-200 font-semibold">${ticketsTotal.toFixed(2)}</span>
            </div>

            {/* Listado de snacks seleccionados */}
            {Object.entries(snacks).filter(([, qty]) => qty > 0).map(([id, qty]) => {
              const sn = SNACKS_CATALOG.find((s) => s.id === id)!;
              return (
                <div key={id} className="flex justify-between text-[11px] text-neutral-400 pl-2 border-l border-neutral-800">
                  <span>{sn.name} × {qty}</span>
                  <span className="text-neutral-300">${(sn.price * qty).toFixed(2)}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs font-bold text-yellow-500">
            <span>TOTAL</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>

          {/* Botones de acción */}
          <div className="mt-5 flex flex-col gap-2">
            <button
              onClick={onNext}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-yellow-500 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-950 hover:bg-yellow-400 active:scale-95 shadow-lg shadow-yellow-500/10 cursor-pointer"
            >
              Continuar al Pago <ChevronRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={onBack}
              className="w-full text-center text-[10px] text-neutral-500 hover:text-neutral-300 mt-2 py-1 transition-colors font-medium cursor-pointer"
            >
              ← Volver a Asientos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
