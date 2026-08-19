const CITY_STORAGE_KEY = "cineapp_saved_city";
const DEFAULT_CITY = "Ciudad de México";

const CITIES_BY_COUNTRY: Record<string, string[]> = {
  MX: ["Ciudad de México", "Guadalajara", "Monterrey"],
  US: ["New York", "Los Angeles", "Miami"],
};

/**
 * Returns the currently saved city, or the default when none is stored.
 *
 * @returns The saved city name or the fallback default.
 */
export function getSavedCity(): string {
  const saved = localStorage.getItem(CITY_STORAGE_KEY);
  return saved ?? DEFAULT_CITY;
}

/**
 * Persists the selected city so future listing requests can reuse it.
 *
 * @param city - The city name to save.
 */
export function saveCity(city: string): void {
  localStorage.setItem(CITY_STORAGE_KEY, city);
}

/**
 * Detects the visitor's city using the browser geolocation API.
 *
 * Uses the stored city first; otherwise resolves coordinates through a
 * reverse-geocode endpoint and falls back to the default city.
 *
 * @returns A promise that resolves with the detected city name.
 */
export async function detectCity(): Promise<string> {
  const saved = getSavedCity();
  if (saved) return saved;

  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
    });

    const { latitude, longitude } = position.coords;
    const country = await guessCountry(latitude, longitude);
    const candidates = CITIES_BY_COUNTRY[country];

    const city = candidates?.[0] ?? DEFAULT_CITY;
    saveCity(city);
    return city;
  } catch {
    return DEFAULT_CITY;
  }
}

/**
 * Best-effort reverse geocoding used as a lightweight country hint.
 *
 * @param latitude - The visitor latitude.
 * @param longitude - The visitor longitude.
 * @returns A promise that resolves with a two-letter country code.
 */
async function guessCountry(latitude: number, longitude: number): Promise<string> {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=es`
    );
    const data = (await response.json()) as { countryCode?: string };
    return data.countryCode ?? "MX";
  } catch {
    return "MX";
  }
}