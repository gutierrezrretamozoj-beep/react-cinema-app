import { useState, useEffect } from "react";
import { FeaturedCarousel } from "./components/FeaturedCarousel";
import type { Movie } from "./data/movieData.ts";
import { MovieCard } from "./components/MovieCard";
import { MOVIES } from "./data/movieData.ts";

import {
  LocationSelector,
  LocationModal,
} from "@/features/location/components";
import { useLocation } from "@/features/location/hooks/useLocation";

// HomePage: Componente de la página principal de la Cartelera de Cine
export const HomePage = () => {
  // FILTROS DE CARTELERA
 

  const [activeTab, setActiveTab] = useState<
    "now-playing" | "coming-soon"
  >("now-playing");

  const [selectedGenre, setSelectedGenre] =
    useState<string>("Todos");

  const [selectedTimeSlot, setSelectedTimeSlot] =
    useState<string | null>(null);

  const [activePreviewMovieId, setActivePreviewMovieId] =
    useState<string | null>(null);

  // --------------------------------------------------
  // LOCATION
  // --------------------------------------------------

  const [isLocationModalOpen, setIsLocationModalOpen] =
    useState(false);

  // La ubicacion se carga desde la API y se conserva en localStorage.
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

  // --------------------------------------------------
  // TOAST
  // --------------------------------------------------

  const [toast, setToast] = useState<{
    message: string;
    subMessage?: string;
  } | null>(null);

  // --------------------------------------------------
  // COMPRA DE BOLETOS
  // --------------------------------------------------

  const handleBuyConfirm = (movie: Movie, time: string) => {
    setToast({
      message:
        movie.status === "coming-soon"
          ? "¡Preventa Confirmada!"
          : "¡Boleto Adquirido!",

      subMessage:
        movie.status === "coming-soon"
          ? `Precompra de ${movie.title} realizada para la función de las ${time}. ¡Te avisaremos el día del estreno!`
          : `${movie.title} • Función de hoy a las ${time} • ¡Disfruta la función!`,
    });
  };

  // --------------------------------------------------
  // CIERRE AUTOMÁTICO DEL TOAST
  // --------------------------------------------------

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [toast]);

  // --------------------------------------------------
  // CARRUSEL
  // --------------------------------------------------

  const handleCarouselBuyClick = (movie: Movie) => {
    setToast({
      message:
        movie.status === "coming-soon"
          ? `Precomprar boletos para: ${movie.title}`
          : `Comprar boletos para: ${movie.title}`,

      subMessage:
        "Selecciona un horario disponible en el boleto de abajo para confirmar tu compra.",
    });

    if (movie.status !== activeTab) {
      setActiveTab(movie.status);
    }

    if (
      selectedGenre !== "Todos" &&
      movie.genre !== selectedGenre
    ) {
      setSelectedGenre("Todos");
    }

    setTimeout(() => {
      const element = document.getElementById(
        `movie-card-${movie.id}`
      );

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        element.classList.add(
          "ring-2",
          "ring-yellow-500",
          "scale-105"
        );

        setTimeout(() => {
          element.classList.remove(
            "ring-2",
            "ring-yellow-500",
            "scale-105"
          );
        }, 2000);
      }
    }, 150);
  };

  // --------------------------------------------------
  // LOCATION - CAMBIO DE PAÍS
  // --------------------------------------------------

  const handleCountryChange = (countryId: string) => {
    const country = countries.find((item) => item.id === Number(countryId));
    setSelectedCountry(country ?? null);
    setSelectedDepartment(null);
    setSelectedCity(null);
  };

  // --------------------------------------------------
  // LOCATION - CAMBIO DE DEPARTAMENTO
  // --------------------------------------------------

  const handleDepartmentChange = (departmentId: string) => {
    const department = departments.find((item) => item.id === Number(departmentId));
    setSelectedDepartment(department ?? null);
    setSelectedCity(null);
  };

  // --------------------------------------------------
  // LOCATION - CAMBIO DE CIUDAD
  // --------------------------------------------------

  const handleCityChange = (cityId: string) => {
    const city = cities.find((item) => item.id === Number(cityId));
    setSelectedCity(city ?? null);
  };

  // --------------------------------------------------
  // LOCATION - CONFIRMAR
  // --------------------------------------------------

  const handleLocationConfirm = () => {
    if (
      !selectedCountry || !selectedDepartment || !selectedCity
    ) {
      return;
    }

    setIsLocationModalOpen(false);
  };

  // --------------------------------------------------
  // FILTROS DE PELÍCULAS
  // --------------------------------------------------

  const filteredMovies = MOVIES.filter((movie) => {
    const matchesTab = movie.status === activeTab;

    const matchesGenre =
      selectedGenre === "Todos" ||
      movie.genre === selectedGenre;

    const matchesTimeSlot =
      !selectedTimeSlot ||
      movie.showtimes.includes(selectedTimeSlot);

    return (
      matchesTab &&
      matchesGenre &&
      matchesTimeSlot
    );
  });

  const genres = [
    "Todos",
    "Acción",
    "Drama",
    "Sci-Fi",
    "Thriller",
    "Terror",
  ];

  const quickTimeSlots = [
    "14:30",
    "17:45",
    "21:00",
  ];

  // --------------------------------------------------
  // LOCATION MOSTRADA EN EL BOTÓN
  // --------------------------------------------------

  const locationName = selectedCity?.name || "Seleccionar ubicación";

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:gap-8">

      {/* ==========================================
          CARRUSEL
      ========================================== */}

      <FeaturedCarousel
        movies={MOVIES}
        onSelectMovie={handleCarouselBuyClick}
      />

      {/* ==========================================
          FILTROS DE HORARIOS + UBICACIÓN
      ========================================== */}

      <section className="rounded-xl border border-neutral-900 bg-neutral-950 p-6 shadow-sm">

       <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

  {/* IZQUIERDA: horarios */}
  <div className="flex flex-col justify-center">
    <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
      Horarios de hoy (Filtro rápido)
    </h3>

    <div className="mt-4 flex flex-wrap gap-3">
      {quickTimeSlots.map((time) => {
        const isActive = selectedTimeSlot === time;

        return (
          <button
            key={time}
            onClick={() =>
              setSelectedTimeSlot(
                isActive ? null : time
              )
            }
            className={`rounded-lg border px-5 py-2.5 font-mono text-sm font-semibold transition-all duration-200 ${
              isActive
                ? "border-yellow-500 bg-yellow-500/10 text-yellow-400 shadow-md shadow-yellow-500/5"
                : "border-neutral-900 bg-neutral-900/40 text-neutral-400 hover:border-neutral-800 hover:text-neutral-200"
            }`}
          >
            {time}
          </button>
        );
      })}
    </div>
  </div>


  {/* DERECHA: ubicación */}
  <div className="flex min-h-30 items-center justify-center md:justify-center">

    <LocationSelector
      locationName={locationName}
      onClick={() =>
        setIsLocationModalOpen(true)
      }
    />

  </div>

</div>

   

      </section>

      {/* ==========================================
          CARTELERA
      ========================================== */}

      <section className="flex flex-col gap-4">

        <div className="flex border-b border-neutral-900">

          <button
            onClick={() => {
              setActiveTab("now-playing");
              setSelectedTimeSlot(null);
            }}
            className={`border-b-2 px-4 pb-3 text-sm font-semibold uppercase tracking-wider transition-all ${
              activeTab === "now-playing"
                ? "border-yellow-500 text-yellow-400"
                : "border-transparent text-neutral-500 hover:text-neutral-300"
            }`}
          >
            En Cartelera
          </button>

          <button
            onClick={() => {
              setActiveTab("coming-soon");
              setSelectedTimeSlot(null);
            }}
            className={`border-b-2 px-4 pb-3 text-sm font-semibold uppercase tracking-wider transition-all ${
              activeTab === "coming-soon"
                ? "border-yellow-500 text-yellow-400"
                : "border-transparent text-neutral-500 hover:text-neutral-300"
            }`}
          >
            Próximamente
          </button>

        </div>

        {/* GÉNEROS */}

        <div className="flex flex-wrap gap-2 pb-2">

          {genres.map((genre) => {
            const isActive =
              selectedGenre === genre;

            return (
              <button
                key={genre}
                onClick={() =>
                  setSelectedGenre(genre)
                }
                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "border-yellow-500/80 bg-yellow-500/5 text-yellow-400"
                    : "border-neutral-800 bg-transparent text-neutral-400 hover:border-neutral-700 hover:text-neutral-200"
                }`}
              >
                {genre}
              </button>
            );
          })}

        </div>

      </section>

      {/* ==========================================
          LISTADO DE PELÍCULAS
      ========================================== */}

      <section className="flex flex-col gap-4">

        <div className="flex items-center justify-between">

          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            {filteredMovies.length}{" "}
            {filteredMovies.length === 1
              ? "película"
              : "películas"}{" "}
            encontradas
          </span>

        </div>

        {filteredMovies.length > 0 ? (

          <div className="grid grid-cols-1 gap-6 pt-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isDimmed={
                  Boolean(activePreviewMovieId) &&
                  activePreviewMovieId !== movie.id
                }
                onPreviewChange={
                  setActivePreviewMovieId
                }
                onBuy={handleBuyConfirm}
              />
            ))}

          </div>

        ) : (

          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-850 bg-neutral-900/10 px-4 py-16 text-center">

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="mb-3 h-10 w-10 text-neutral-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0Zm-9 3.75h.008v.008H12v-.008Z"
              />
            </svg>

            <h4 className="text-sm font-bold text-neutral-300">
              No hay resultados para esta búsqueda
            </h4>

            <p className="mt-1 max-w-sm text-xs text-neutral-500">
              Prueba cambiando la pestaña de estreno,
              quitando el filtro de horario rápido o
              seleccionando otro género.
            </p>

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

      {/* ==========================================
          TOAST
      ========================================== */}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex max-w-sm animate-slide-in rounded-xl border border-yellow-500/20 bg-neutral-900 p-4 shadow-2xl shadow-yellow-500/5 backdrop-blur-md">

          <div className="flex gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-400">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.89-.777-2.384-.179-2.384 1.009v1.231H10a.75.75 0 1 0 0 1.5h1.25V15a.75.75 0 1 0 1.5 0v-3.178c0-.687.525-1.25 1.182-1.25a.75.75 0 1 0 0-1.5c-.22 0-.424.08-.58.211Z"
                  clipRule="evenodd"
                />
              </svg>

            </div>

            <div className="flex flex-col gap-0.5">

              <h5 className="text-xs font-bold text-neutral-100">
                {toast.message}
              </h5>

              {toast.subMessage && (
                <p className="text-[11px] leading-relaxed text-neutral-400">
                  {toast.subMessage}
                </p>
              )}

            </div>

            <button
              onClick={() => setToast(null)}
              className="ml-auto shrink-0 text-neutral-500 hover:text-neutral-300"
              aria-label="Cerrar notificación"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-3.5 w-3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

          </div>

        </div>
      )}

      {/* ==========================================
          MODAL DE UBICACIÓN
      ========================================== */}

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() =>
          setIsLocationModalOpen(false)
        }

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