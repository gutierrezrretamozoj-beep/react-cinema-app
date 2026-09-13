import { useEffect, useState } from "react";
import { FeaturedCarousel } from "./components/FeaturedCarousel";
import type { Movie } from "./data/movieData.ts";
import { MovieCard } from "./components/MovieCard";
import { MovieCardSkeleton } from "./components/MovieCardSkeleton";
import { MOVIES as FALLBACK_MOVIES } from "./data/movieData.ts";
import { movieService } from "@/features/movies/services/movie.service";
import { genreService } from "@/shared/services/genre.service";
import { mapMovieListItemToMovie } from "@/features/movies/utils/mappers";
import { LocationSelector, LocationModal } from "@/features/location/components";
import { useLocation } from "@/features/location/hooks/useLocation";
import { useCart } from "@/features/cart/CartContext";

/**
 * Home page displaying the movie billboard with real backend integration and offline fallback.
 * @returns JSX element
 */
export const HomePage = () => {
  const { addMovieToCart } = useCart();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [genres, setGenres] = useState<string[]>(["Todos", "Acción", "Drama", "Sci-Fi", "Thriller", "Terror"]);

  const [activeTab, setActiveTab] = useState<"now-playing" | "coming-soon">("now-playing");
  const [selectedGenre, setSelectedGenre] = useState<string>("Todos");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [activePreviewMovieId, setActivePreviewMovieId] = useState<string | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const {
    countries,
    departments,
    cities,
    selectedCountry,
    selectedDepartment,
    selectedCity,
    setSelectedCountry,
    setSelectedDepartment,
    setSelectedCity,
  } = useLocation();

  useEffect(() => {
    let mounted = true;
    movieService
      .getAll()
      .then((items) => {
        if (!mounted) return;
        const mapped = items.map(mapMovieListItemToMovie);
        setMovies(mapped.length > 0 ? mapped : FALLBACK_MOVIES);
        setIsOffline(mapped.length === 0);
      })
      .catch(() => {
        if (!mounted) return;
        setMovies(FALLBACK_MOVIES);
        setIsOffline(true);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    genreService
      .getAll()
      .then((items) => {
        if (!mounted) return;
        if (items.length > 0) setGenres(["Todos", ...items.map((g) => g.name)]);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  /**
   * Handles ticket purchase confirmation.
   * @param movie - Selected movie
   * @param time - Selected showtime
   */
  const handleBuyConfirm = (movie: Movie, time: string) => {
    void addMovieToCart(movie, time);
  };

  /**
   * Handles carousel selection and scrolls to the movie card.
   * @param movie - Selected featured movie
   */
  const handleCarouselBuyClick = (movie: Movie) => {
    if (movie.status !== activeTab) {
      setActiveTab(movie.status);
    }
    if (selectedGenre !== "Todos" && movie.genre !== selectedGenre) {
      setSelectedGenre("Todos");
    }
    setTimeout(() => {
      const element = document.getElementById(`movie-card-${movie.id}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.classList.add("ring-2", "ring-yellow-500", "scale-105");
        setTimeout(() => {
          element.classList.remove("ring-2", "ring-yellow-500", "scale-105");
        }, 2000);
      }
    }, 150);
  };

  /**
   * Handles country selection change.
   * @param countryId - Selected country id
   */
  const handleCountryChange = (countryId: string) => {
    const country = countries.find((item) => item.id === Number(countryId));
    setSelectedCountry(country ?? null);
    setSelectedDepartment(null);
    setSelectedCity(null);
  };

  /**
   * Handles department selection change.
   * @param departmentId - Selected department id
   */
  const handleDepartmentChange = (departmentId: string) => {
    const department = departments.find((item) => item.id === Number(departmentId));
    setSelectedDepartment(department ?? null);
    setSelectedCity(null);
  };

  /**
   * Handles city selection change.
   * @param cityId - Selected city id
   */
  const handleCityChange = (cityId: string) => {
    const city = cities.find((item) => item.id === Number(cityId));
    setSelectedCity(city ?? null);
  };

  /**
   * Confirms location selection and closes modal.
   */
  const handleLocationConfirm = () => {
    if (!selectedCountry || !selectedDepartment || !selectedCity) return;
    setIsLocationModalOpen(false);
  };

  const filteredMovies = movies.filter((movie) => {
    const matchesTab = movie.status === activeTab;
    const matchesGenre = selectedGenre === "Todos" || movie.genre === selectedGenre;
    const matchesTimeSlot = !selectedTimeSlot || movie.showtimes.includes(selectedTimeSlot);
    return matchesTab && matchesGenre && matchesTimeSlot;
  });

  const quickTimeSlots = ["14:30", "17:45", "21:00"];
  const locationName = selectedCity?.name || "Seleccionar ubicación";

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:gap-8">
      {isOffline && (
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-400">
          Modo offline — mostrando catálogo local. Conecta el backend en {import.meta.env.VITE_API_URL as string} para datos en vivo.
        </div>
      )}

      <FeaturedCarousel movies={movies} onSelectMovie={handleCarouselBuyClick} />

      <section className="rounded-xl border border-neutral-900 bg-neutral-950 p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col justify-center">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">Horarios de hoy (Filtro rápido)</h3>
            <div className="mt-4 flex flex-wrap gap-3">
              {quickTimeSlots.map((time) => {
                const isActive = selectedTimeSlot === time;
                return (
                  <button
                    key={time}
                    onClick={() => setSelectedTimeSlot(isActive ? null : time)}
                    className={`rounded-lg border px-5 py-2.5 font-mono text-sm font-semibold transition-all duration-200 ${isActive ? "border-yellow-500 bg-yellow-500/10 text-yellow-400 shadow-md shadow-yellow-500/5" : "border-neutral-900 bg-neutral-900/40 text-neutral-400 hover:border-neutral-800 hover:text-neutral-200"}`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex min-h-30 items-center justify-center md:justify-center">
            <LocationSelector locationName={locationName} onClick={() => setIsLocationModalOpen(true)} />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex border-b border-neutral-900">
          <button
            onClick={() => {
              setActiveTab("now-playing");
              setSelectedTimeSlot(null);
            }}
            className={`border-b-2 px-4 pb-3 text-sm font-semibold uppercase tracking-wider transition-all ${activeTab === "now-playing" ? "border-yellow-500 text-yellow-400" : "border-transparent text-neutral-500 hover:text-neutral-300"}`}
          >
            En Cartelera
          </button>
          <button
            onClick={() => {
              setActiveTab("coming-soon");
              setSelectedTimeSlot(null);
            }}
            className={`border-b-2 px-4 pb-3 text-sm font-semibold uppercase tracking-wider transition-all ${activeTab === "coming-soon" ? "border-yellow-500 text-yellow-400" : "border-transparent text-neutral-500 hover:text-neutral-300"}`}
          >
            Próximamente
          </button>
        </div>
        <div className="flex flex-wrap gap-2 pb-2">
          {genres.map((genre) => {
            const isActive = selectedGenre === genre;
            return (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-200 ${isActive ? "border-yellow-500/80 bg-yellow-500/5 text-yellow-400" : "border-neutral-800 bg-transparent text-neutral-400 hover:border-neutral-700 hover:text-neutral-200"}`}
              >
                {genre}
              </button>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            {loading ? "Cargando..." : `${filteredMovies.length} ${filteredMovies.length === 1 ? "película" : "películas"} encontradas`}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 pt-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredMovies.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 pt-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isDimmed={Boolean(activePreviewMovieId) && activePreviewMovieId !== movie.id}
                onPreviewChange={setActivePreviewMovieId}
                onBuy={handleBuyConfirm}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-850 bg-neutral-900/10 px-4 py-16 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mb-3 h-10 w-10 text-neutral-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            <h4 className="text-sm font-bold text-neutral-300">No hay resultados para esta búsqueda</h4>
            <p className="mt-1 max-w-sm text-xs text-neutral-500">Prueba cambiando la pestaña de estreno, quitando el filtro de horario rápido o seleccionando otro género.</p>
            <button
              onClick={() => {
                setSelectedGenre("Todos");
                setSelectedTimeSlot(null);
                setActiveTab("now-playing");
              }}
              className="mt-4 rounded-lg bg-neutral-800 px-4 py-2 text-xs font-semibold text-neutral-200 transition hover:bg-neutral-700"
            >
              Restablecer filtros
            </button>
          </div>
        )}
      </section>

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        countries={countries}
        departments={departments}
        cities={cities}
        selectedCountry={selectedCountry?.id ?? ""}
        selectedDepartment={selectedDepartment?.id ?? ""}
        selectedCity={selectedCity?.id ?? ""}
        onCountryChange={handleCountryChange}
        onDepartmentChange={handleDepartmentChange}
        onCityChange={handleCityChange}
        onConfirm={handleLocationConfirm}
      />
    </div>
  );
};
