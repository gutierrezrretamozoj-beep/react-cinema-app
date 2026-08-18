import type {
  Country,
  Department,
  City,
} from "../types/location.types";



interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;

  countries: Country[];
  departments: Department[];
  cities: City[];

  selectedCountry: string;
  selectedDepartment: string;
  selectedCity: string;

  onCountryChange: (country: string) => void;
  onDepartmentChange: (department: string) => void;
  onCityChange: (city: string) => void;

  onConfirm: () => void;
}

export const LocationModal = ({
  isOpen,
  onClose,
}: LocationModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-modal-title"
    >
      <div className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-950 p-6 shadow-2xl">

        {/* Encabezado */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2
              id="location-modal-title"
              className="text-xl font-bold text-white"
            >
              Selecciona tu ubicación
            </h2>

            <p className="mt-1 text-sm text-neutral-400">
              Selecciona tu país, departamento y ciudad.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
            aria-label="Cerrar selección de ubicación"
          >
            ✕
          </button>
        </div>

        {/* Campos */}
        <div className="space-y-5">

          {/* País */}
          <div>
            <label
              htmlFor="country"
              className="mb-2 block text-sm font-medium text-neutral-300"
            >
              País
            </label>

            <select
              id="country"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-500"
            >
              <option value="">
                Selecciona un país
              </option>
            </select>
          </div>

          {/* Departamento */}
          <div>
            <label
              htmlFor="department"
              className="mb-2 block text-sm font-medium text-neutral-300"
            >
              Departamento
            </label>

            <select
              id="department"
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm text-neutral-500 outline-none"
            >
              <option value="">
                Selecciona un departamento
              </option>
            </select>
          </div>

          {/* Ciudad */}
          <div>
            <label
              htmlFor="city"
              className="mb-2 block text-sm font-medium text-neutral-300"
            >
              Ciudad
            </label>

            <select
              id="city"
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm text-neutral-500 outline-none"
            >
              <option value="">
                Selecciona una ciudad
              </option>
            </select>
          </div>

        </div>

        {/* Acciones */}
        <div className="mt-7 flex justify-end gap-3">

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-neutral-800 px-5 py-3 text-sm font-semibold text-neutral-300 transition hover:bg-neutral-900 hover:text-white"
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-xl bg-yellow-500/40 px-5 py-3 text-sm font-bold text-neutral-950/60"
          >
            Confirmar ubicación
          </button>

        </div>

      </div>
    </div>
  );
};