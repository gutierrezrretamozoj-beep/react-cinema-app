import { useState } from "react";
import { RegisterForm } from "../../components";

// Información de cada promoción.
interface MoviePromo {
  video: string;
  image: string;
}

// Videos e imágenes que se utilizarán en el fondo.
const moviePromos: MoviePromo[] = [
  {
    video: "/video/video-spiderman.mp4",
    image: "/image/imagen-spiderman.jpeg",
  },
  {
    video: "/video/video-moana.mp4",
    image: "/image/imagen-moana.jpeg",
  },
];

const AUTH_VIDEO_KEY = "authVideoIndex";

const getNextMovieIndex = (storageKey: string) => {
  const lastMovie = localStorage.getItem(storageKey);
  const lastIndex =
    lastMovie !== null && !Number.isNaN(Number(lastMovie))
      ? Number(lastMovie)
      : null;

  let nextMovie = Math.floor(Math.random() * moviePromos.length);
  if (lastIndex !== null && moviePromos.length > 1 && nextMovie === lastIndex) {
    nextMovie = (nextMovie + 1) % moviePromos.length;
  }

  localStorage.setItem(storageKey, String(nextMovie));
  return nextMovie;
};

export const RegisterPage = () => {
  // Cambia la película cada vez que se entra a la página.
  const [movieIndex] = useState(() =>
    getNextMovieIndex(AUTH_VIDEO_KEY)
  );

  // Indica si el video terminó.
  const [videoFinished, setVideoFinished] = useState(false);

  // Película seleccionada para esta entrada.
  const currentMovie = moviePromos[movieIndex];

  return (
    <main className="relative min-h-screen overflow-hidden bg-black">

      {/* ==================== FONDO ==================== */}

      <div className="absolute inset-0">

        {/* Reproduce la película seleccionada */}
        {!videoFinished ? (
          <video
            autoPlay
            muted
            playsInline
            onEnded={() => setVideoFinished(true)}
            className="h-full w-full object-cover"
          >
            <source
              src={currentMovie.video}
              type="video/mp4"
            />
          </video>
        ) : (
          /* Imagen final de la misma película */
          <img
            src={currentMovie.image}
            alt="Fondo cinematográfico"
            className="h-full w-full object-contain object-center"
          />
        )}

        {/* Oscurecimiento general */}
        <div
          className="absolute inset-0"
          style={{
            background: "rgba(0, 0, 0, 0.25)",
          }}
        />

        {/* Sombra superior */}
        <div
          className="absolute inset-x-0 top-0 h-40"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.95), rgba(0,0,0,0))",
          }}
        />

        {/* Sombra inferior */}
        <div
          className="absolute inset-x-0 bottom-0 h-80"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.8), rgba(0,0,0,0))",
          }}
        />

        {/* Sombra izquierda */}
        <div
          className="absolute inset-y-0 left-0 w-64"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0))",
          }}
        />

        {/* Sombra detrás del registro */}
        <div
          className="absolute inset-y-0 right-0 w-2/5"
          style={{
            background:
              "linear-gradient(to left, rgba(0,0,0,0.95), rgba(0,0,0,0.55), rgba(0,0,0,0))",
          }}
        />

      </div>

      {/* Contenido sobre el video */}
      <div className="relative z-10 min-h-screen">

              {/* ==================== TEXTO ==================== */}

        <section
          className="
            absolute
            bottom-8
            left-6
            z-20
            max-w-xl
            sm:bottom-10
            sm:left-10
            lg:bottom-12
            lg:left-14
          "
        >

          {/* Título pequeño */}
          <p className="mb-3 text-sm font-semibold uppercase tracking-[4px] text-yellow-500 sm:text-base">
            Welcome
          </p>

          {/* Nombre de la aplicación */}
          <h1 className="text-5xl font-black leading-none tracking-tight text-white sm:text-6xl lg:text-7xl">
            THE REAL
          </h1>

          <h2 className="text-5xl font-black leading-none tracking-tight text-yellow-500 sm:text-6xl lg:text-7xl">
            FILMS
          </h2>

          {/* Línea decorativa */}
          <div className="mt-5 h-1 w-20 rounded-full bg-yellow-500" />

          {/* Descripción */}
          <p className="mt-5 max-w-lg text-sm leading-6 text-neutral-200 sm:text-base sm:leading-7">
            Crea tu cuenta y forma parte de nuestra experiencia
            cinematográfica.
          </p>

        </section>

        {/* ==================== REGISTRO ==================== */}

        <section
          className="
            absolute
            right-2
            top-1/2
            z-30
            w-90
            -translate-y-1/2
            sm:right-6
            sm:w-97.5
            lg:right-10
            lg:w-102.5
            xl:right-14
            xl:w-107.5
            2xl:right-20
          "
        >

          {/* Tarjeta de registro */}
          <div className="w-full">

            <RegisterForm />

          </div>

        </section>
                {/* Fin del contenido principal */}

      </div>
    </main>
  );
};