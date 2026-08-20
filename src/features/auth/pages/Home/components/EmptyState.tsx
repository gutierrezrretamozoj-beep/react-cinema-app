interface EmptyStateProps {
  onReset: () => void;
}

// EmptyState: Placeholder visual cuando los filtros no devuelven resultados
// Guía al usuario con un mensaje claro y una acción para restablecer filtros.
export const EmptyState = ({ onReset }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center border border-dashed border-neutral-800 rounded-2xl py-20 px-4 text-center bg-neutral-900/10">
    {/* Icono de búsqueda vacía */}
    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 mb-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.3}
        stroke="currentColor"
        className="w-7 h-7 text-neutral-600"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
    </div>

    <h4 className="text-sm font-bold text-neutral-200">Sin resultados para esta búsqueda</h4>
    <p className="text-xs text-neutral-500 mt-2 max-w-xs leading-relaxed">
      Ninguna película coincide con los filtros activos. Prueba cambiando el género, la fecha o la pestaña de cartelera.
    </p>

    <button
      onClick={onReset}
      className="mt-6 rounded-lg border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 hover:border-neutral-600 px-5 py-2 text-xs font-semibold text-neutral-200 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-500/40"
    >
      Restablecer filtros
    </button>
  </div>
);
