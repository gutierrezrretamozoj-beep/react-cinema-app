# Movies Feature

Feature de cartelera de cine: catálogo, capa de API, gestión de ciudad y motor
de filtros con persistencia en la URL.

## Estructura

```text
movies/
├── api/
│   ├── moviesApi.ts        # Cliente HTTP (Fetch) para los 4 endpoints
│   └── locationService.ts  # Detección/guardado de la ciudad del visitante
├── data/
│   ├── movies.json         # Contrato mock consumido por la capa de API
│   └── index.ts            # Exports tipados del mock
├── helpers/
│   ├── filterHelpers.ts    # Motor de filtros y serialización URL
│   └── showtimeHelpers.ts  # Reglas de negocio: showtimes activos/agotados
├── hooks/
│   └── useMovieListings.ts # Hook principal con URL persistence
├── interfaces/
│   └── index.ts            # Tipos del contrato
└── index.ts                # Barrel público del feature
```

## Contrato de la API

La capa `moviesApi.ts` consume los siguientes endpoints. Cuando el backend no
está disponible, cada función resuelve con el mock de `data/movies.json`.

| Endpoint            | Función           | Descripción                                   |
| ------------------- | ----------------- | --------------------------------------------- |
| `GET /movies`       | `getMovies`       | Catálogo completo de la ciudad.               |
| `GET /movies/weekly`| `getWeeklyMovies` | Películas con funciones de la semana.         |
| `GET /movies/today` | `getTodayMovies`  | Películas con funciones de hoy (`now-playing`). |
| `GET /movies/filter`| `getFilteredMovies` | Películas filtradas por estado, género y horario. |

Todas las peticiones incluyen la ciudad guardada (`city`) como parámetro de
consulta; se obtiene con `getSavedCity()` / `detectCity()`.

## Mock data (`movies.json`)

Contrato tipado por `Movie` en `interfaces/`. Puntos clave:

- Cada **showtime** es un objeto `{ id, time, isActive, isSoldOut }`:
  - `isActive: false` → función cancelada/inactiva, se excluye del dataset.
  - `isSoldOut: true` → función agotada, se conserva pero marcada.
- La respuesta ya normalizada **excluye** las películas sin funciones activas.
- `normalizeActiveMovies()` y `getActiveShowtimes()` aplican la regla de
  exclusión; `isShowtimeSoldOut()` consulta la bandera de agotado.

## Filtros y URL

`useMovieListings` sincroniza los filtros con query parameters:

- `status` → `now-playing` | `coming-soon`
- `genre` → `Acción`, `Drama`, `Sci-Fi`, `Thriller`, `Terror`
- `timeSlot` → `HH:MM`

Cualquier cambio re-renderiza los resultados sin recargar; la URL es la única
fuente de verdad, así que se puede recargar o compartir. `clearAllFilters()`
resetea estado y URL en una sola acción.