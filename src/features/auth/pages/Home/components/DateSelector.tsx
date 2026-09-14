import { useMemo } from "react";

interface DateSelectorProps {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

// DateSelector: Selector interactivo de 7 días para filtrar funciones
// Genera dinámicamente los próximos 7 días desde hoy y permite seleccionar uno.
export const DateSelector = ({ selectedDate, onSelectDate }: DateSelectorProps) => {
  const days = useMemo(() => {
    const result = [];
    const today = new Date();
    const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const key = date.toISOString().split("T")[0];
      result.push({
        key,
        dayName: i === 0 ? "Hoy" : i === 1 ? "Mañana" : dayNames[date.getDay()],
        dayNumber: date.getDate(),
        month: monthNames[date.getMonth()],
        isToday: i === 0,
      });
    }
    return result;
  }, []);

  return (
    <section className="rounded-xl border border-neutral-900 bg-neutral-950 p-6 shadow-sm">
      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-3.5">
        Selecciona un día
      </h3>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {days.map(({ key, dayName, dayNumber, month, isToday }) => {
          const isActive = selectedDate === key;
          return (
            <button
              key={key}
              onClick={() => onSelectDate(isActive ? "" : key)}
              className={`flex flex-col items-center min-w-[3.5rem] rounded-xl border px-3 py-2.5 transition-all duration-200 ${
                isActive
                  ? "border-yellow-500 bg-yellow-500/10 text-yellow-400 shadow-md shadow-yellow-500/5"
                  : isToday
                  ? "border-neutral-700 bg-neutral-900/60 text-neutral-200 hover:border-neutral-600"
                  : "border-neutral-900 bg-neutral-900/40 text-neutral-500 hover:border-neutral-700 hover:text-neutral-300"
              }`}
            >
              <span className="text-[9px] font-semibold uppercase tracking-wider mb-0.5">
                {dayName}
              </span>
              <span className="text-base font-bold leading-none">{dayNumber}</span>
              <span className="text-[9px] text-current/60 mt-0.5">{month}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
