import { MOCK_MOVIES } from "../data";
import type { ListingsParams, ListingsResponse, MovieFilters } from "../interfaces";
import { applyFilters } from "../helpers/filterHelpers";
import { normalizeActiveMovies } from "../helpers/showtimeHelpers";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001/api";
const SIMULATED_DELAY_MS = 400;

/**
 * Builds the query string for a listing request, always injecting the city.
 *
 * @param params - The request parameters.
 * @returns A URL encoded query string.
 */
function buildQuery(params: ListingsParams): string {
  const search = new URLSearchParams();

  search.set("city", params.city);
  if (params.status) search.set("status", params.status);
  if (params.genre) search.set("genre", params.genre);
  if (params.timeSlot) search.set("timeSlot", params.timeSlot);

  return search.toString();
}

/**
 * Fetches and parses a JSON response from the movies API.
 *
 * @param path - The endpoint path, e.g. `/movies`.
 * @param params - The query parameters to send.
 * @returns A promise that resolves with the parsed listings response.
 */
async function fetchJson(path: string, params: ListingsParams): Promise<ListingsResponse> {
  const query = buildQuery(params);
  const response = await fetch(`${API_BASE_URL}${path}?${query}`);

  if (!response.ok) {
    throw new Error(`Movies API error: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as ListingsResponse;
}

/**
 * Returns the full movie catalog for a given city.
 *
 * @param params - The request parameters (city is required).
 * @returns A promise that resolves with the full listings response.
 */
export function getMovies(params: ListingsParams): Promise<ListingsResponse> {
  return fetchJson("/movies", params).catch(() => mockListings(params));
}

/**
 * Returns the movies featured for the current week.
 *
 * @param params - The request parameters (city is required).
 * @returns A promise that resolves with the weekly listings response.
 */
export function getWeeklyMovies(params: ListingsParams): Promise<ListingsResponse> {
  return fetchJson("/movies/weekly", params).catch(() => mockListings(params));
}

/**
 * Returns the movies with showtimes available today.
 *
 * @param params - The request parameters (city is required).
 * @returns A promise that resolves with the today listings response.
 */
export function getTodayMovies(params: ListingsParams): Promise<ListingsResponse> {
  const todayParams = { ...params, status: "now-playing" as const };
  return fetchJson("/movies/today", todayParams).catch(() => mockListings(todayParams));
}

/**
 * Returns the movies matching the given filters.
 *
 * @param params - The request parameters (city is required).
 * @param filters - The filters to apply server side.
 * @returns A promise that resolves with the filtered listings response.
 */
export function getFilteredMovies(params: ListingsParams, filters: MovieFilters): Promise<ListingsResponse> {
  const mergedParams = {
    ...params,
    status: filters.status ?? undefined,
    genre: filters.genre ?? undefined,
    timeSlot: filters.timeSlot ?? undefined,
  };

  return fetchJson("/movies/filter", mergedParams).catch(() => mockFiltered(mergedParams, filters));
}

/**
 * Mock fallback for the full/plain listing endpoints.
 *
 * @param params - The request parameters.
 * @returns A simulated listings response.
 */
function mockListings(params: ListingsParams): Promise<ListingsResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const movies = normalizeActiveMovies(MOCK_MOVIES);
      resolve({
        success: true,
        city: params.city,
        total: movies.length,
        movies,
      });
    }, SIMULATED_DELAY_MS);
  });
}

/**
 * Mock fallback for the filtered listing endpoint.
 *
 * @param params - The request parameters.
 * @param filters - The filters to apply.
 * @returns A simulated filtered listings response.
 */
function mockFiltered(params: ListingsParams, filters: MovieFilters): Promise<ListingsResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const movies = applyFilters(normalizeActiveMovies(MOCK_MOVIES), filters);
      resolve({
        success: true,
        city: params.city,
        total: movies.length,
        movies,
        filters,
      });
    }, SIMULATED_DELAY_MS);
  });
}