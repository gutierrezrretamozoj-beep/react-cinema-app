// Movie: Interfaz para definir el modelo de datos de una película
// Especifica todos los campos necesarios para renderizar el carrusel y las tarjetas del boleto.
export interface Movie {
  id: string;
  title: string;
  genre: 'Acción' | 'Drama' | 'Sci-Fi' | 'Thriller' | 'Terror';
  rating: 'A' | 'B' | 'B15' | 'C';
  status: 'now-playing' | 'coming-soon';
  posterUrl: string;
  backdropUrl: string;
  featured: boolean;
  duration: string;
  synopsis: string;
  showtimes: string[];
}

// MOVIES: Base de datos estática de películas en cartelera y próximos estrenos
// Almacena la información de las 8 películas principales que consume la aplicación.
export const MOVIES: Movie[] = [
  {
    id: "1",
    title: "Interestelar II: Más allá del Horizonte",
    genre: "Sci-Fi",
    rating: "B15",
    status: "now-playing",
    posterUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=1200&auto=format&fit=crop&q=80",
    featured: true,
    duration: "148 min",
    synopsis: "Un grupo de científicos emprende un viaje sin retorno a través de una anomalía en el espacio para rescatar los restos de una expedición perdida.",
    showtimes: ["14:30", "17:45", "21:00"]
  },
  {
    id: "2",
    title: "El Susurro del Viento",
    genre: "Drama",
    rating: "B15",
    status: "now-playing",
    posterUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1513553404607-988bf2703777?w=1200&auto=format&fit=crop&q=80",
    featured: false,
    duration: "112 min",
    synopsis: "La cruda historia de un hombre que busca reconstruir su vida en un pueblo costero tras perder la memoria en un trágico accidente de barco.",
    showtimes: ["15:00", "18:30", "21:30"]
  },
  {
    id: "3",
    title: "Las Crónicas del Espejo",
    genre: "Terror",
    rating: "C",
    status: "now-playing",
    posterUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=1200&auto=format&fit=crop&q=80",
    featured: false,
    duration: "105 min",
    synopsis: "Cuando un portal antiguo se abre a través de una reliquia familiar, una joven debe enfrentar sus peores pesadillas hechas realidad.",
    showtimes: ["16:15", "19:00", "22:00"]
  },
  {
    id: "4",
    title: "Bajo la Luz de Neón",
    genre: "Thriller",
    rating: "C",
    status: "now-playing",
    posterUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200&auto=format&fit=crop&q=80",
    featured: true,
    duration: "124 min",
    synopsis: "Un detective atormentado por su pasado se ve envuelto en una red de conspiraciones y traiciones en el corazón nocturno de la ciudad.",
    showtimes: ["14:00", "17:15", "20:30"]
  },
  {
    id: "5",
    title: "Retorno a la Inocencia",
    genre: "Drama",
    rating: "B15",
    status: "now-playing",
    posterUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80",
    featured: false,
    duration: "118 min",
    synopsis: "Una mujer redescubre sus raíces y la importancia del perdón familiar al regresar a la hacienda donde pasó su infancia.",
    showtimes: ["15:30", "18:00", "20:45"]
  },
  {
    id: "6",
    title: "En la Sombra del Bosque",
    genre: "Terror",
    rating: "C",
    status: "coming-soon",
    posterUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=600&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=1200&auto=format&fit=crop&q=80",
    featured: false,
    duration: "98 min",
    synopsis: "Un campamento de verano se convierte en una lucha de supervivencia cuando una presencia ancestral despierta entre los árboles.",
    showtimes: ["18:00", "20:30", "23:00"]
  },
  {
    id: "7",
    title: "Velocidad Terminal",
    genre: "Acción",
    rating: "B",
    status: "coming-soon",
    posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&auto=format&fit=crop&q=80",
    featured: false,
    duration: "135 min",
    synopsis: "Un corredor de élite retirado es forzado a realizar una última entrega a alta velocidad a través de una metrópolis sitiada.",
    showtimes: ["13:00", "16:00", "19:00"]
  },
  {
    id: "8",
    title: "Gravedad Cero: Misión Alfa",
    genre: "Sci-Fi",
    rating: "A",
    status: "coming-soon",
    posterUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80",
    featured: true,
    duration: "110 min",
    synopsis: "La tripulación de la estación internacional debe improvisar un escape desesperado cuando una lluvia imprevista de basura espacial destruye sus naves de retorno.",
    showtimes: ["14:30", "17:30", "20:30"]
  }
];
