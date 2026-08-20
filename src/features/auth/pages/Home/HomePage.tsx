import { useState, useEffect } from "react";
import { MovieCard } from "./components/MovieCard";
import { FeaturedCarousel } from "./components/FeaturedCarousel";
import { DateSelector } from "./components/DateSelector";
import { EmptyState } from "./components/EmptyState";
import { MovieGridSkeleton } from "./components/MovieCardSkeleton";
import { MOVIES } from "./data/movieData";
import type { Movie } from "./data/movieData";

// HomePage: Componente de la página principal de la Cartelera de Cine
// Controla los filtros, estados de carga, notificaciones y visualización del carrusel y listado de películas.
export const HomePage = () => {
  // ── Estado de carga inicial ──
  const [isLoading, setIsLoading] = useState(true);

  // ── Filtros de navegación ──
  const [activeTab, setActiveTab] = useState<"now-playing" | "coming-soon">("now-playing");
  const [selectedGenre, setSelectedGenre] = useState<string>("Todos");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [activePreviewMovieId, setActivePreviewMovieId] = useState<string | null>(null);

  // ── Toast flotante ──
  const [toast, setToast] = useState<{ message: string; subMessage?: string; type?: "buy" | "info" } | null>(null);

  // Simula la carga inicial de datos (fetch real reemplazaría este timeout)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  // Auto-cierre del toast tras 4 segundos
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  // handleCarouselBuyClick: Acción de enfoque de compra desde el carrusel
  const handleCarouselBuyClick = (movie: Movie) => {
    setToast({
      message: movie.status === "coming-soon"
        ? `Precomprar boletos para: ${movie.title}`
        : `Comprar boletos para: ${movie.title}`,
      subMessage: "Selecciona un horario disponible en la tarjeta de abajo para confirmar.",
      type: "info",
    });

    if (movie.status !== activeTab) setActiveTab(movie.status);
    if (selectedGenre !== "Todos" && movie.genre !== selectedGenre) setSelectedGenre("Todos");

    setTimeout(() => {
      const element = document.getElementById(`movie-card-${movie.id}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.classList.add("ring-2", "ring-yellow-500", "scale-105");
        setTimeout(() => element.classList.remove("ring-2", "ring-yellow-500", "scale-105"), 2000);
      }
    }, 150);
  };

  // handleBuy: Acción de compra desde la tarjeta de película
  const handleBuy = (movie: Movie, selectedTime: string) => {
    setToast({
      message: movie.status === "coming-soon"
        ? `¡Precompra registrada! ${movie.title}`
        : `¡Compra exitosa! ${movie.title}`,
      subMessage: `Horario: ${selectedTime} • Tu entrada ha sido reservada.`,
      type: "buy",
    });
  };

  // handleReset: Restablece todos los filtros al estado inicial
  const handleReset = () => {
    setSelectedGenre("Todos");
    setSelectedTimeSlot(null);
    setSelectedDate("");
    setActiveTab("now-playing");
  };

  // filteredMovies: Selector dinámico del grid de películas
  const filteredMovies = MOVIES.filter((movie) => {
    const matchesTab = movie.status === activeTab;
    const matchesGenre = selectedGenre === "Todos" || movie.genre === selectedGenre;
    const matchesTimeSlot = !selectedTimeSlot || movie.showtimes.includes(selectedTimeSlot);
    return matchesTab && matchesGenre && matchesTimeSlot;
  });

  const genres = ["Todos", "Acción", "Drama", "Sci-Fi", "Thriller", "Terror"];
  const quickTimeSlots = ["14:30", "17:45", "21:00"];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 flex flex-col gap-6 md:gap-8">
      {/* Carrusel destacado */}
      <FeaturedCarousel movies={MOVIES} onSelectMovie={handleCarouselBuyClick} />

      {/* Selector de fecha (7 días) */}
      <DateSelector selectedDate={selectedDate} onSelectDate={setSelectedDate} />

      {/* Horarios rápidos */}
      <section className="rounded-xl border border-neutral-900 bg-neutral-950 p-6 shadow-sm">
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-3.5">
          Horarios de hoy (Filtro rápido)
        </h3>
        <div className="flex gap-3 flex-wrap">
          {quickTimeSlots.map((time) => {
            const isActive = selectedTimeSlot === time;
            return (
              <button
                key={time}
                onClick={() => setSelectedTimeSlot(isActive ? null : time)}
                className={`rounded-lg px-5 py-2.5 font-mono text-sm font-semibold transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-yellow-500/40 ${
                  isActive
                    ? "border-yellow-500 bg-yellow-500/10 text-yellow-400 shadow-md shadow-yellow-500/5"
                    : "border-neutral-900 bg-neutral-900/40 text-neutral-400 hover:border-neutral-800 hover:text-neutral-200"
                }`}
              >
                {time}
              </button>
            );
          })}
          {selectedDate && (
            <div className="flex items-center rounded-lg border border-yellow-500/30 bg-yellow-500/5 px-3 py-2.5 text-xs text-yellow-400">
              <span className="font-mono font-semibold">{selectedDate}</span>
              <button
                onClick={() => setSelectedDate("")}
                className="ml-2 text-yellow-500/60 hover:text-yellow-400"
                aria-label="Quitar filtro de fecha"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Tabuladores y filtros de género */}
      <section className="flex flex-col gap-4">
        <div className="flex border-b border-neutral-900">
          {(["now-playing", "coming-soon"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSelectedTimeSlot(null); }}
              className={`pb-3 text-sm font-semibold uppercase tracking-wider transition-all border-b-2 px-4 focus:outline-none ${
                activeTab === tab
                  ? "border-yellow-500 text-yellow-400"
                  : "border-transparent text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {tab === "now-playing" ? "En Cartelera" : "Próximamente"}
            </button>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap pb-2">
          {genres.map((genre) => {
            const isActive = selectedGenre === genre;
            return (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-yellow-500/30 ${
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

      {/* Grid de películas con skeleton, empty state y resultados */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            {isLoading
              ? "Cargando películas..."
              : `${filteredMovies.length} ${filteredMovies.length === 1 ? "película" : "películas"} encontradas`}
          </span>
          {(selectedGenre !== "Todos" || selectedTimeSlot || selectedDate) && !isLoading && (
            <button
              onClick={handleReset}
              className="text-[11px] text-neutral-500 hover:text-yellow-400 transition-colors underline underline-offset-2"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Loading skeleton */}
        {isLoading ? (
          <MovieGridSkeleton count={4} />
        ) : filteredMovies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isDimmed={Boolean(activePreviewMovieId) && activePreviewMovieId !== movie.id}
                onPreviewChange={setActivePreviewMovieId}
                onBuy={handleBuy}
              />
            ))}
          </div>
        ) : (
          <EmptyState onReset={handleReset} />
        )}
      </section>

      {/* Toast flotante */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex max-w-sm animate-slide-in rounded-xl border bg-neutral-900 p-4 shadow-2xl backdrop-blur-md ${
            toast.type === "buy"
              ? "border-emerald-500/20 shadow-emerald-500/5"
              : "border-yellow-500/20 shadow-yellow-500/5"
          }`}
        >
          <div className="flex gap-3">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                toast.type === "buy" ? "bg-emerald-500/10 text-emerald-400" : "bg-yellow-500/10 text-yellow-400"
              }`}
            >
              {toast.type === "buy" ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25Z" />
                </svg>
              )}
            </div>
            <div className="flex flex-col gap-0.5">
              <h5 className="text-xs font-bold text-neutral-100">{toast.message}</h5>
              {toast.subMessage && (
                <p className="text-[11px] leading-relaxed text-neutral-400">{toast.subMessage}</p>
              )}
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-neutral-500 hover:text-neutral-300 shrink-0 ml-auto focus:outline-none"
              aria-label="Cerrar notificación"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
