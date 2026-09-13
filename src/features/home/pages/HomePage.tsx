import { MOVIES } from "@/features/movies/data/movieData";
import { HomeHeroCarousel } from "../components/HomeHeroCarousel";
import { MovieScrollRow } from "../components/MovieScrollRow";
import { CinemaTheatersSection } from "../components/CinemaTheatersSection";

// HomePage: Vista principal cinematográfica basada en el boceto a mano
export const HomePage = () => {
  const nowPlayingMovies = MOVIES.filter((m) => m.status === "now-playing");
  const comingSoonMovies = MOVIES.filter((m) => m.status === "coming-soon");

  return (
    <div className="w-full flex flex-col min-h-screen bg-transparent text-cinema-text">
      {/* 1. Carrusel Hero a Pantalla Completa (Full Width) */}
      <HomeHeroCarousel />

      {/* 2. Línea divisoria cinematográfica idéntica al trazo del boceto */}
      <div className="w-full border-b border-cinema-border relative">
        <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-cinema-muted to-transparent" />
      </div>

      {/* Contenedor centralizado para las secciones de contenido */}
      <div className="mt-5 mx-auto max-w-450 w-[90%] px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex flex-col gap-12 sm:gap-16">
        
        {/* 3. Sección "En Cartelera" (Máx 4 películas + Tarjeta "Ver más" a /movies) */}
        <MovieScrollRow
          title="En Cartelera"
          subtitle="Películas disponibles hoy en taquilla y salas premium"
          movies={nowPlayingMovies}
          seeMoreUrl="/movies"
          seeMoreLabel="Ver Cartelera"
          maxMovies={5}
        />

        {/* 4. Sección "Próximamente" (Máx 4 películas + Tarjeta "Ver más" a /coming-movies) */}
        <MovieScrollRow
          title="Próximamente"
          subtitle="Los estrenos más esperados que llegarán a nuestras pantallas"
          movies={comingSoonMovies}
          seeMoreUrl="/coming-movies"
          seeMoreLabel="Ver Próximos"
          maxMovies={5}
        />

        {/* 5. Sección "Nuestros Cines" */}
        <CinemaTheatersSection />

      </div>

      {/* Footer elegante y sutil de la app */}
      <footer className="w-full border-t border-cinema-border bg-black/25 backdrop-blur-md py-10 mt-12 text-center text-xs text-cinema-muted">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <img src="/src/assets/icons/logo-cine.svg" className="w-10 h-10" alt="Logo" />
            <img src="/src/assets/icons/nombre-cine.svg" className="w-30 h-auto" alt="Logo" />
            <span className="text-neutral-600">|</span>
            <span>Experiencia Cinemática 3D</span>
          </div>
          <p>© 2026 DEXUS Cinemas. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};
