import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { getMovies } from "../api/moviesApi";
import { detectCity, saveCity, type LocationResult } from "../api/locationService";
import type { ListingsResponse, Movie, MovieFilters, MovieGenre, MovieStatus } from "../interfaces";
import { applyFilters, filtersFromParams, filtersToParams, hasActiveFilters } from "../helpers/filterHelpers";
import { normalizeActiveMovies } from "../helpers/showtimeHelpers";

const DEFAULT_STATUS: MovieStatus = "now-playing";
const DEFAULT_GENRE: MovieGenre | null = null;

export interface UseMovieListingsResult {
  city: string;
  location: LocationResult | null;
  loading: boolean;
  needsLocationSelection: boolean;
  allMovies: Movie[];
  movies: Movie[];
  filters: MovieFilters;
  status: MovieStatus;
  genre: MovieGenre | null;
  timeSlot: string | null;
  hasActiveFilters: boolean;
  selectCity: (cityName: string) => void;
  setStatus: (status: MovieStatus) => void;
  setGenre: (genre: MovieGenre | null) => void;
  setTimeSlot: (timeSlot: string | null) => void;
  clearAllFilters: () => void;
}

/**
 * Main listings hook: synchronizes filters with the URL, fetches the movie
 * catalog for the resolved city and applies the filters in real time.
 *
 * When geolocation is unavailable or denied, `needsLocationSelection` becomes
 * true so the UI can render the manual city selector.
 *
 * @returns The movie list, filters and the filter actions.
 */
export function useMovieListings(): UseMovieListingsResult {
  const [searchParams, setSearchParams] = useSearchParams();
  const [city, setCity] = useState<string>("");
  const [location, setLocation] = useState<LocationResult | null>(null);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [loadedCity, setLoadedCity] = useState<string | null>(null);

  useEffect(() => {
    detectCity().then((result) => {
      setLocation(result);
      setCity(result.city);
    });
  }, []);

  useEffect(() => {
    if (!city || loadedCity === city) return;

    getMovies({ city })
      .then((response: ListingsResponse) => {
        setAllMovies(normalizeActiveMovies(response.movies));
        setLoadedCity(city);
      });
  }, [city, loadedCity]);

  const filters = useMemo(() => {
    const fromParams = filtersFromParams(searchParams);
    return {
      status: fromParams.status ?? DEFAULT_STATUS,
      genre: fromParams.genre ?? DEFAULT_GENRE,
      timeSlot: fromParams.timeSlot,
    };
  }, [searchParams]);

  const movies = useMemo(() => applyFilters(allMovies, filters), [allMovies, filters]);

  const updateParams = useCallback(
    (next: MovieFilters) => {
      setSearchParams(filtersToParams(next));
    },
    [setSearchParams]
  );

  const setStatus = useCallback(
    (status: MovieStatus) => updateParams({ ...filters, status }),
    [updateParams, filters]
  );

  const setGenre = useCallback(
    (genre: MovieGenre | null) => updateParams({ ...filters, genre }),
    [updateParams, filters]
  );

  const setTimeSlot = useCallback(
    (timeSlot: string | null) => updateParams({ ...filters, timeSlot }),
    [updateParams, filters]
  );

  const clearAllFilters = useCallback(() => {
    updateParams({ status: DEFAULT_STATUS, genre: null, timeSlot: null });
  }, [updateParams]);

  const selectCity = useCallback((cityName: string) => {
    saveCity(cityName);
    setLocation({ status: "saved", city: cityName });
    setCity(cityName);
  }, []);

  return {
    city,
    location,
    loading: !city || loadedCity !== city,
    needsLocationSelection: location !== null && location.status === "denied",
    allMovies,
    movies,
    filters,
    status: filters.status,
    genre: filters.genre,
    timeSlot: filters.timeSlot,
    hasActiveFilters: hasActiveFilters(filters),
    selectCity,
    setStatus,
    setGenre,
    setTimeSlot,
    clearAllFilters,
  };
};