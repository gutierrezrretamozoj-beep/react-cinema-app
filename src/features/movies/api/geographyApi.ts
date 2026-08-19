import { MOCK_GEOGRAPHY } from "../data";
import type { City, Country, Department } from "../interfaces";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001/api";
const SIMULATED_DELAY_MS = 300;

/**
 * Fetches and parses a JSON response from the country/department/city API.
 *
 * @param path - The endpoint path, e.g. `/countries`.
 * @param signal - Optional signal to cancel the request.
 * @returns A promise that resolves with the parsed JSON response.
 */
async function fetchJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { signal });

  if (!response.ok) {
    throw new Error(`Geolocation API error: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
}

/**
 * Simulates a resolved response by delaying the mock value.
 *
 * @param value - The mock value to resolve.
 * @returns A promise that resolves with the mock value after a short delay.
 */
function mockResolve<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), SIMULATED_DELAY_MS);
  });
}

/**
 * Returns the catalog of supported countries.
 *
 * @param signal - Optional signal to cancel the request.
 * @returns A promise that resolves with the available countries.
 */
export function getCountries(signal?: AbortSignal): Promise<Country[]> {
  return fetchJson<Country[]>("/countries", signal).catch(() => mockResolve(MOCK_GEOGRAPHY.countries));
}

/**
 * Returns the departments of a given country.
 *
 * @param countryId - The identifier of the parent country.
 * @param signal - Optional signal to cancel the request.
 * @returns A promise that resolves with the departments of the country.
 */
export function getDepartments(countryId: number, signal?: AbortSignal): Promise<Department[]> {
  const departments = MOCK_GEOGRAPHY.departments.filter((department) => department.countryId === countryId);
  return fetchJson<Department[]>(`/departments?countryId=${countryId}`, signal).catch(() => mockResolve(departments));
}

/**
 * Returns the active cities of a given department.
 *
 * @param departmentId - The identifier of the parent department.
 * @param signal - Optional signal to cancel the request.
 * @returns A promise that resolves with the cities of the department.
 */
export async function getCities(departmentId: number, signal?: AbortSignal): Promise<City[]> {
  try {
    const response = await fetchJson<{ success: boolean; data: City[] }>(
      `/cities?departmentId=${departmentId}`,
      signal
    );
    return response.data;
  } catch {
    const cities = MOCK_GEOGRAPHY.cities.filter((city) => city.departmentId === departmentId);
    return mockResolve(cities);
  }
}