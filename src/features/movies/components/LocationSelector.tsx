import { useEffect, useState } from "react";
import { getCities, getCountries, getDepartments } from "../api/geographyApi";
import type { City, Country, Department } from "../interfaces";

export interface LocationSelectorProps {
  onSelect: (cityName: string) => void;
  onCancel: () => void;
}

/**
 * Country -> department -> city cascading selector.
 *
 * Used when geolocation permission is denied so the visitor can pick their city
 * manually. Options are loaded from the geography API (mock fallback) as each
 * level is resolved.
 */
export const LocationSelector = ({ onSelect, onCancel }: LocationSelectorProps) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [countryId, setCountryId] = useState<number | null>(null);
  const [departmentId, setDepartmentId] = useState<number | null>(null);
  const [cityId, setCityId] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    getCountries(controller.signal)
      .then((items) => {
        setCountries(items);
        setCountryId(items[0]?.id ?? null);
      })
      .catch(() => undefined);

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (countryId === null) return;

    const controller = new AbortController();
    getDepartments(countryId, controller.signal).then(setDepartments).catch(() => undefined);

    return () => controller.abort();
  }, [countryId]);

  useEffect(() => {
    if (departmentId === null) return;

    const controller = new AbortController();
    getCities(departmentId, controller.signal).then(setCities).catch(() => undefined);

    return () => controller.abort();
  }, [departmentId]);

  const departmentsLoadedFor = departments[0]?.countryId ?? null;
  const citiesLoadedFor = cities[0]?.departmentId ?? null;

  const loadingDepartments = countryId !== null && departmentsLoadedFor !== countryId;
  const loadingCities = departmentId !== null && citiesLoadedFor !== departmentId;

  const selectedCity = cities.find((city) => city.id === cityId) ?? null;

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDepartments([]);
    setCities([]);
    setCountryId(Number(event.target.value));
    setDepartmentId(null);
    setCityId(null);
  };

  const handleDepartmentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCities([]);
    setDepartmentId(Number(event.target.value));
    setCityId(null);
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-neutral-900 bg-neutral-950 p-6 shadow-2xl shadow-black/50">
      <div className="mb-5">
        <h3 className="text-lg font-bold text-neutral-100">Selecciona tu ciudad</h3>
        <p className="mt-1 text-xs leading-5 text-neutral-400">
          No pudimos detectar tu ubicación automáticamente. Elige tu país, departamento y ciudad para ver la
          cartelera correcta.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="location-country" className="text-xs font-semibold text-neutral-400">
            País
          </label>
          <select
            id="location-country"
            value={countryId ?? ""}
            onChange={handleCountryChange}
            className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-sm text-neutral-200 outline-none transition focus:border-yellow-500/60"
          >
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="location-department" className="text-xs font-semibold text-neutral-400">
            Departamento
          </label>
          <select
            id="location-department"
            value={departmentId ?? ""}
            onChange={handleDepartmentChange}
            className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-sm text-neutral-200 outline-none transition focus:border-yellow-500/60"
          >
            <option value="">-- Selecciona un departamento --</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
          {loadingDepartments && <span className="text-[11px] text-neutral-500">Cargando departamentos...</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="location-city" className="text-xs font-semibold text-neutral-400">
            Ciudad
          </label>
          <select
            id="location-city"
            value={cityId ?? ""}
            onChange={(event) => setCityId(Number(event.target.value))}
            disabled={departmentId === null}
            className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-sm text-neutral-200 outline-none transition focus:border-yellow-500/60 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">-- Selecciona una ciudad --</option>
            {cities
              .filter((city) => city.isActive)
              .map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
          </select>
          {loadingCities && <span className="text-[11px] text-neutral-500">Cargando ciudades...</span>}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <button
          disabled={!selectedCity}
          onClick={() => selectedCity && onSelect(selectedCity.name)}
          className="w-full rounded-lg bg-yellow-500 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Usar esta ciudad
        </button>
        <button
          onClick={onCancel}
          className="w-full rounded-lg py-2 text-xs text-neutral-500 transition hover:text-neutral-300"
        >
          Continuar con la ciudad predeterminada
        </button>
      </div>
    </div>
  );
};