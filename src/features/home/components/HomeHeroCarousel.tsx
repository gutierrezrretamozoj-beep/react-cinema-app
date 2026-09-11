import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { MOVIES, getFriendlyRating, type Movie } from "@/features/movies/data/movieData";
import { PROMOTIONS, type Promotion } from "../data/promotionsData";

type HeroSlide =
  | {
      type: "movie";
      id: string;
      title: string;
      director: string;
      duration: string;
      rating: string;
      averageRating: string;
      genre: string;
      synopsis: string;
      backdropUrl: string;
      badgeText: string;
      linkUrl: string;
      ctaText: string;
      movieRef: Movie;
    }
  | {
      type: "promo";
      id: string;
      title: string;
      subtitle: string;
      validity: string;
      benefit: string;
      averageRating: string;
      categoryLabel: string;
      synopsis: string;
      backdropUrl: string;
      badgeText: string;
      linkUrl: string;
      ctaText: string;
      promoRef: Promotion;
    };

export const HomeHeroCarousel = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const featuredMovies = MOVIES.filter((m) => m.featured);

  // Lista de slides curada: películas de gran impacto + promociones con textos contextuales
  const slides: HeroSlide[] = [
    ...(featuredMovies.slice(0, 2).map((m) => ({
      type: "movie" as const,
      id: `movie-${m.id}`,
      title: m.title,
      director: m.director || "Christopher Nolan",
      duration: m.duration,
      rating: m.rating,
      averageRating: m.averageRating || "4.8",
      genre: m.genre,
      synopsis: m.synopsis,
      backdropUrl: m.backdropUrl || m.posterUrl,
      badgeText: m.status === "coming-soon" ? "PREVENTA EXCLUSIVA" : "ESTRENO DESTACADO",
      linkUrl: `/movies/${m.id}`,
      ctaText: "Ver detalles",
      movieRef: m,
    }))),
    {
      type: "promo" as const,
      id: `promo-${PROMOTIONS[0].id}`,
      title: PROMOTIONS[0].title,
      subtitle: PROMOTIONS[0].subtitle,
      validity: "Todos los martes",
      benefit: "2x1 Boletas",
      averageRating: "5.0",
      categoryLabel: "Promoción Semanal",
      synopsis: PROMOTIONS[0].description,
      backdropUrl: PROMOTIONS[0].backdropUrl,
      badgeText: PROMOTIONS[0].badge,
      linkUrl: PROMOTIONS[0].targetUrl,
      ctaText: "Ver detalles",
      promoRef: PROMOTIONS[0],
    },
    ...(featuredMovies.slice(2, 3).map((m) => ({
      type: "movie" as const,
      id: `movie-${m.id}`,
      title: m.title,
      director: m.director || "Director Destacado",
      duration: m.duration,
      rating: m.rating,
      averageRating: m.averageRating || "4.5",
      genre: m.genre,
      synopsis: m.synopsis,
      backdropUrl: m.backdropUrl || m.posterUrl,
      badgeText: "FAVORITA DEL PÚBLICO",
      linkUrl: `/movies/${m.id}`,
      ctaText: "Ver detalles",
      movieRef: m,
    }))),
    {
      type: "promo" as const,
      id: `promo-${PROMOTIONS[1].id}`,
      title: PROMOTIONS[1].title,
      subtitle: PROMOTIONS[1].subtitle,
      validity: "Toda la temporada",
      benefit: "Combo Dúo",
      averageRating: "4.9",
      categoryLabel: "Confitería Gourmet",
      synopsis: PROMOTIONS[1].description,
      backdropUrl: PROMOTIONS[1].backdropUrl,
      badgeText: PROMOTIONS[1].badge,
      linkUrl: PROMOTIONS[1].targetUrl,
      ctaText: "Ver detalles",
      promoRef: PROMOTIONS[1],
    },
  ];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Soporte de deslizamiento táctil en móviles y tablets (Swipe)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;

    if (diffX > 45) {
      handleNext();
    } else if (diffX < -45) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  // Autoplay cada 6 segundos (se pausa al pasar el cursor)
  useEffect(() => {
    if (isHovered) return;

    timerRef.current = setInterval(() => {
      handleNext();
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isHovered]);

  const currentSlide = slides[currentIndex];

  return (
    <div
      className="relative w-full h-[620px] sm:h-[680px] lg:h-[650px] overflow-hidden bg-neutral-950 select-none group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* IMAGEN HORIZONTAL PANORÁMICA DE ANCHO COMPLETO */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 w-full h-full cursor-pointer"
          onClick={() => navigate(currentSlide.linkUrl)}
        >
          <img
            src={currentSlide.backdropUrl}
            alt={currentSlide.title}
            className="w-full h-full object-cover object-center"
          />

          {/* Gradientes cinematográficos ajustados para máxima nitidez */}
          <div className="absolute inset-0 bg-linear-to-r from-neutral-950/90 via-neutral-950/20 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-neutral-950/90 via-neutral-950/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* CONTENIDO SUPERPUESTO */}
      <div className="relative mx-auto max-w-7xl h-full px-4 sm:px-6 lg:px-8 flex items-center z-20 pointer-events-none">
        <div className="w-full max-w-xl text-left pointer-events-auto">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id + "-info"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="flex flex-col gap-5 p-6 sm:p-8 bg-transparent"
            >
              
              {/* Badge de Categoría (Sin contador numérico por pedido del usuario) */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.25em] uppercase bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />
                  {currentSlide.badgeText}
                </span>
              </div>

              {/* TÍTULO DE IMPACTO EN MAYÚSCULAS */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase leading-[1.05] font-serif drop-shadow-md">
                {currentSlide.title}
              </h1>

              {/* SUBTÍTULO CONTEXTUAL: Director si es película, o subtítulo descriptivo si es promoción */}
              {currentSlide.type === "movie" ? (
                <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-neutral-300/90 flex items-center gap-2">
                  <span className="text-yellow-500">DIRIGIDA POR:</span>
                  <span>{currentSlide.director}</span>
                </p>
              ) : (
                <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-yellow-400/90 flex items-center gap-2">
                  <span>{currentSlide.subtitle}</span>
                </p>
              )}

              {/* MINI SINOPSIS */}
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed line-clamp-2 font-normal max-w-xl">
                {currentSlide.synopsis}
              </p>

              {/* BOTÓN CON FONDO TRANSPARENTE (Solo texto y borde, color al hover) */}
              <div className="pt-2 flex items-center gap-4">
                <Link
                  to={currentSlide.linkUrl}
                  className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-white/40 bg-transparent px-7 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:border-yellow-500 hover:bg-yellow-500 hover:text-neutral-950 hover:shadow-lg hover:shadow-yellow-500/20 active:scale-95 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.5 3.75a.75.75 0 0 0-1.125.65v15.2a.75.75 0 0 0 1.125.65l13.5-7.6a.75.75 0 0 0 0-1.3l-13.5-7.6Z" />
                  </svg>
                  <span>{currentSlide.ctaText}</span>
                </Link>
              </div>

              {/* FILA DE MÉTRICAS CONTEXTUALES: Adaptadas a Película o a Promoción */}
              <div className="pt-4 mt-2 border-t border-white/10 grid grid-cols-3 sm:grid-cols-4 gap-4 text-left">
                {currentSlide.type === "movie" ? (
                  <>
                    <div>
                      <div className="text-base sm:text-lg font-black text-white font-mono leading-none">
                        {currentSlide.duration}
                      </div>
                      <div className="text-[9px] uppercase tracking-widest text-neutral-400 mt-1">
                        Duración
                      </div>
                    </div>

                    <div>
                      <div className="text-base sm:text-lg font-black text-yellow-400 font-mono leading-none">
                        {currentSlide.averageRating} ★
                      </div>
                      <div className="text-[9px] uppercase tracking-widest text-neutral-400 mt-1">
                        Rating
                      </div>
                    </div>

                    <div>
                      <div className="text-base sm:text-lg font-black text-white font-mono leading-none">
                        {getFriendlyRating(currentSlide.rating)}
                      </div>
                      <div className="text-[9px] uppercase tracking-widest text-neutral-400 mt-1">
                        Clasificación
                      </div>
                    </div>

                    <div className="hidden sm:block">
                      <div className="text-base sm:text-lg font-black text-neutral-200 font-mono leading-none">
                        {currentSlide.genre}
                      </div>
                      <div className="text-[9px] uppercase tracking-widest text-neutral-400 mt-1">
                        Género
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <div className="text-base sm:text-lg font-black text-white font-mono leading-none">
                        {currentSlide.validity}
                      </div>
                      <div className="text-[9px] uppercase tracking-widest text-neutral-400 mt-1">
                        Vigencia
                      </div>
                    </div>

                    <div>
                      <div className="text-base sm:text-lg font-black text-yellow-400 font-mono leading-none">
                        {currentSlide.benefit}
                      </div>
                      <div className="text-[9px] uppercase tracking-widest text-neutral-400 mt-1">
                        Beneficio
                      </div>
                    </div>

                    <div>
                      <div className="text-base sm:text-lg font-black text-white font-mono leading-none">
                        {currentSlide.averageRating} ★
                      </div>
                      <div className="text-[9px] uppercase tracking-widest text-neutral-400 mt-1">
                        Aceptación
                      </div>
                    </div>

                    <div className="hidden sm:block">
                      <div className="text-base sm:text-lg font-black text-neutral-200 font-mono leading-none">
                        {currentSlide.categoryLabel}
                      </div>
                      <div className="text-[9px] uppercase tracking-widest text-neutral-400 mt-1">
                        Categoría
                      </div>
                    </div>
                  </>
                )}
              </div>

            </motion.div>
          </AnimatePresence>

        </div>
      </div>

      {/* FLECHAS DE NAVEGACIÓN: Visibles únicamente en Desktop (ocultas en móviles y tablets) */}
      <button
        onClick={handlePrev}
        aria-label="Anterior diapositiva"
        className="hidden lg:flex absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 h-11 w-11 items-center justify-center rounded-full bg-transparent backdrop-blur-sm text-white hover:border-yellow-500 hover:text-yellow-400 hover:bg-black/20 transition-all hover:scale-110 active:scale-95 cursor-pointer"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      <button
        onClick={handleNext}
        aria-label="Siguiente diapositiva"
        className="hidden lg:flex absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 h-11 w-11 items-center justify-center rounded-full bg-transparent backdrop-blur-sm text-white hover:border-yellow-500 hover:text-yellow-400 hover:bg-black/20 transition-all hover:scale-110 active:scale-95 cursor-pointer"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* INDICADORES INFERIORES TIPO BARRA */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, i) => {
          const isActive = currentIndex === i;
          return (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                isActive ? "w-8 bg-yellow-500 shadow-sm shadow-yellow-500/50" : "w-2 bg-white/30 hover:bg-white/60"
              }`}
              aria-label={`Ir al slide ${i + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
};
