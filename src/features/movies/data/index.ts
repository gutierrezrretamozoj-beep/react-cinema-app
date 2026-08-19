import moviesJson from "./movies.json";
import type { Movie } from "../interfaces";

export const MOCK_MOVIES = moviesJson.movies as Movie[];
export const MOCK_CITY = moviesJson.city;

export { moviesJson as MOCK_MOVIES_RAW };