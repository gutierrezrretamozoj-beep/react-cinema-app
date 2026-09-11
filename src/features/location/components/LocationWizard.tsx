import type { LocationOption, LocationSelection } from "../types/indextypes";

interface LocationWizardProps {
  isOpen: boolean;
  countries: LocationOption[];
  departments: LocationOption[];
  cities: LocationOption[];

  selection: LocationSelection;

  onCountryChange: (countryId: string | number) => void;
  onDepartmentChange: (departmentId: string | number) => void;
  onCityChange: (cityId: string | number) => void;

  onConfirm: () => void;
  onClose?: () => void;
}

interface LocationFieldProps {
  label: string;
  value: string | number;
  options: LocationOption[];
  disabled?: boolean;
  onChange: (value: string) => void;
}

const LocationField = ({
  label,
  value,
  options,
  disabled = false,
  onChange,
}: LocationFieldProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-neutral-300">
        {label}
      </label>

      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-neutral-100 outline-none transition focus:border-yellow-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <option value="">
          Selecciona {label.toLowerCase()}
        </option>

        {options.map((option) => (
          <option
            key={option.id}
            value={option.id}
          >
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export const LocationWizard = ({
  isOpen,
  countries,
  departments,
  cities,
  selection,
  onCountryChange,
  onDepartmentChange,
  onCityChange,
  onConfirm,
  onClose,
}: LocationWizardProps) => {
  if (!isOpen) {
    return null;
  }

  const isComplete =
    Boolean(selection.country) &&
    Boolean(selection.department) &&
    Boolean(selection.city);

  const hasCountry = Boolean(selection.country);
  const hasDepartment = Boolean(selection.department);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-title"
        className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-950 p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-500">
              Ubicación
            </p>

            <h2
              id="location-title"
              className="mt-1 text-2xl font-bold text-neutral-100"
            >
              ¿Dónde estás?
            </h2>

            <p className="mt-2 text-sm text-neutral-400">
              Selecciona tu ubicación para mostrar los cines disponibles.
            </p>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar selector de ubicación"
              className="rounded-lg p-2 text-neutral-500 transition hover:bg-neutral-900 hover:text-neutral-200"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <LocationField
            label="País"
            value={selection.country}
            options={countries}
            onChange={onCountryChange}
          />

          <LocationField
            label="Departamento"
            value={selection.department}
            options={departments}
            disabled={!hasCountry}
            onChange={onDepartmentChange}
          />

          <LocationField
            label="Ciudad"
            value={selection.city}
            options={cities}
            disabled={!hasDepartment}
            onChange={onCityChange}
          />
        </div>

        <button
          type="button"
          disabled={!isComplete}
          onClick={onConfirm}
          className="mt-6 w-full rounded-xl bg-yellow-500 px-4 py-3 text-sm font-bold uppercase tracking-wide text-neutral-950 transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-500"
        >
          Confirmar ubicación
        </button>
      </div>
    </div>
  );
};