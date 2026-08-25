import { useMemo } from 'react';

interface DateSelectorProps {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

// DateSelector: Selector interactivo de 7 días
// Genera dinámicamente los próximos 7 días y permite seleccionar uno.
export const DateSelector = ({ selectedDate, onSelectDate }: DateSelectorProps) => {
  const days = useMemo(() => {
    const result = [];
    const today = new Date();
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const iso = date.toISOString().split('T')[0]; // YYYY-MM-DD
      result.push({
        iso,
        dayName: i === 0 ? 'Hoy' : i === 1 ? 'Mañana' : dayNames[date.getDay()],
        dayNum: date.getDate(),
        month: monthNames[date.getMonth()],
      });
    }
    return result;
  }, []);

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" role="group" aria-label="Selector de fecha">
      {days.map(({ iso, dayName, dayNum, month }) => {
        const isSelected = selectedDate === iso;
        return (
          <button
            key={iso}
            onClick={() => onSelectDate(iso)}
            aria-pressed={isSelected}
            className={`flex flex-col items-center justify-center min-w-[3.5rem] px-3 py-2.5 rounded-xl border transition-all duration-200 shrink-0
              focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500
              ${
                isSelected
                  ? 'bg-yellow-500/10 border-yellow-500 text-yellow-400'
                  : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
              }`}
          >
            <span className="text-[9px] font-semibold uppercase tracking-wider leading-none">
              {dayName}
            </span>
            <span className="text-lg font-bold leading-tight mt-0.5">{dayNum}</span>
            <span className="text-[9px] text-neutral-500 leading-none">{month}</span>
          </button>
        );
      })}
    </div>
  );
};
