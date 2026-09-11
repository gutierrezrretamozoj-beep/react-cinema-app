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

  selectedCountry: string | number;
  selectedDepartment: string | number;
  selectedCity: string | number;

  onCountryChange: (countryId: string) => void;
  onDepartmentChange: (departmentId: string) => void;
  onCityChange: (cityId: string) => void;

  onConfirm: () => void;
}

export const LocationModal = ({
  isOpen,
  onClose,
  countries,
  departments,
  cities,
  selectedCountry,
  selectedDepartment,
  selectedCity,
  onCountryChange,
  onDepartmentChange,
  onCityChange,
  onConfirm,
}: LocationModalProps) => {
  if (!isOpen) {
    return null;
  }

  const hasCountry = Boolean(selectedCountry);
  const hasDepartment = Boolean(selectedDepartment);
  const isComplete = hasCountry && hasDepartment && Boolean(selectedCity);

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
              value={selectedCountry}
              onChange={(event) => onCountryChange(event.target.value)}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-500"
            >
              <option value="">
                Selecciona un país
              </option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
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
              value={selectedDepartment}
              disabled={!hasCountry}
              onChange={(event) => onDepartmentChange(event.target.value)}
              className={`w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm outline-none transition focus:border-yellow-500 ${hasCountry ? "cursor-pointer text-white" : "cursor-not-allowed text-neutral-500 opacity-60"}`}
            >
              <option value="">
                Selecciona un departamento
              </option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
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
              value={selectedCity}
              disabled={!hasDepartment}
              onChange={(event) => onCityChange(event.target.value)}
              className={`w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm outline-none transition focus:border-yellow-500 ${hasDepartment ? "cursor-pointer text-white" : "cursor-not-allowed text-neutral-500 opacity-60"}`}
            >
              <option value="">
                Selecciona una ciudad
              </option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
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
            disabled={!isComplete}
            onClick={onConfirm}
            className="rounded-xl bg-yellow-500 px-5 py-3 text-sm font-bold text-neutral-950 transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:bg-yellow-500/40 disabled:text-neutral-950/60"
          >
            Confirmar ubicación
          </button>

        </div>

      </div>
    </div>
  );
};