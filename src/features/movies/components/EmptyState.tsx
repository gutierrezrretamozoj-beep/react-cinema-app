interface EmptyStateProps {
  onClearFilters: () => void;
}

// EmptyState: Placeholder cuando los filtros no devuelven resultados
export const EmptyState = ({ onClearFilters }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center border border-dashed border-neutral-800 rounded-2xl py-16 px-4 text-center bg-neutral-900/10 col-span-full">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-12 h-12 text-neutral-600 mb-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
      />
    </svg>
    <h4 className="text-sm font-bold text-neutral-300">Sin resultados para esta búsqueda</h4>
    <p className="text-xs text-neutral-500 mt-1.5 max-w-xs leading-relaxed">
      Prueba cambiando el género, la franja horaria o la pestaña de cartelera.
    </p>
    <button
      onClick={onClearFilters}
      className="mt-5 rounded-lg bg-neutral-800 hover:bg-neutral-700 px-5 py-2 text-xs font-semibold text-neutral-200 transition
        focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
    >
      Restablecer filtros
    </button>
  </div>
);
