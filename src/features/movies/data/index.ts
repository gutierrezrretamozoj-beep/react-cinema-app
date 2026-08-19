import moviesJson from "./movies.json";
import geoJson from "./geo.json";
import type { City, Country, Department, Movie } from "../interfaces";

export const MOCK_MOVIES = moviesJson.movies as Movie[];
export const MOCK_CITY = moviesJson.city;

export const MOCK_GEOGRAPHY = {
  countries: geoJson.countries as Country[],
  departments: geoJson.departments as Department[],
  cities: geoJson.cities as City[],
};

export { moviesJson as MOCK_MOVIES_RAW };
export { geoJson as MOCK_GEOGRAPHY_RAW };
