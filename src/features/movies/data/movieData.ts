export type MovieRating = 'familiar' | '+15' | '+18' | 'NAPTP';

// Movie: Interfaz para definir el modelo de datos de una película
export interface Movie {
  id: string;
  title: string;
  genre: 'Acción' | 'Drama' | 'Sci-Fi' | 'Thriller' | 'Terror';
  rating: MovieRating;
  status: 'now-playing' | 'coming-soon';
  posterUrl: string;
  backdropUrl: string;
  featured: boolean;
  duration: string;
  synopsis: string;
  showtimes: string[];

  // Metadatos adicionales
  trailerUrl?: string;
  director?: string;
  cast?: string[];
  releaseDate?: string;
  languages?: string[];
  formats?: string[];
  prices?: string[];
  averageRating?: string;
}

export interface RatingBadgeProps {
  label: string;
  badgeClass: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

// Configuración de badges por clasificación según requerimiento visual
export const getRatingBadgeProps = (rating?: string): RatingBadgeProps => {
  switch (rating) {
    case 'familiar':
    case 'A':
      return {
        label: 'Familiar',
        badgeClass: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
        badgeBg: 'bg-emerald-500/15',
        badgeText: 'text-emerald-400',
        badgeBorder: 'border-emerald-500/30',
      };
    case '+15':
    case 'B':
    case 'B15':
      return {
        label: '+15',
        badgeClass: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
        badgeBg: 'bg-amber-500/15',
        badgeText: 'text-amber-400',
        badgeBorder: 'border-amber-500/30',
      };
    case '+18':
    case 'C':
      return {
        label: '+18',
        badgeClass: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
        badgeBg: 'bg-orange-500/15',
        badgeText: 'text-orange-400',
        badgeBorder: 'border-orange-500/30',
      };
    case 'NAPTP':
      return {
        label: 'NAPTP',
        badgeClass: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
        badgeBg: 'bg-rose-500/15',
        badgeText: 'text-rose-400',
        badgeBorder: 'border-rose-500/30',
      };
    default:
      return {
        label: rating || 'General',
        badgeClass: 'bg-neutral-500/15 text-neutral-300 border border-neutral-500/30',
        badgeBg: 'bg-neutral-500/15',
        badgeText: 'text-neutral-300',
        badgeBorder: 'border-neutral-500/30',
      };
  }
};

// Función auxiliar para mostrar clasificaciones en lenguaje claro y amigable
export const getFriendlyRating = (rating?: string): string => {
  return getRatingBadgeProps(rating).label;
};

// MOVIES: Base de datos estática de películas en cartelera y próximos estrenos
export const MOVIES: Movie[] = [
  {
    id: "1",
    title: "Interestelar II: Más allá del Horizonte",
    genre: "Sci-Fi",
    rating: "familiar",
    status: "now-playing",
    posterUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=1200&auto=format&fit=crop&q=80",
    featured: true,
    duration: "148 min",
    synopsis: "Un grupo de científicos emprende un viaje sin retorno a través de una anomalía en el espacio para rescatar los restos de una expedición perdida.",
    showtimes: ["14:30", "17:45", "21:00"],
    trailerUrl: "https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1&mute=1&controls=0&loop=1&playlist=ScMzIvxBSi4",
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Jessica Chastain", "Anne Hathaway"],
    releaseDate: "2026-09-18",
    languages: ["English", "Spanish"],
    formats: ["2D", "IMAX", "4DX"],
    prices: ["$9.50", "$13.00", "$16.50"],
    averageRating: "4.8/5",
  },
  {
    id: "2",
    title: "El Susurro del Viento",
    genre: "Drama",
    rating: "+15",
    status: "now-playing",
    posterUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1513553404607-988bf2703777?w=1200&auto=format&fit=crop&q=80",
    featured: false,
    duration: "112 min",
    synopsis: "La cruda historia de un hombre que busca reconstruir su vida en un pueblo costero tras perder la memoria en un trágico accidente de barco.",
    showtimes: ["15:00", "18:30", "21:30"],
    trailerUrl: "https://www.youtube.com/embed/aqz-KE-bpKQ?autoplay=1&mute=1&controls=0&loop=1&playlist=aqz-KE-bpKQ",
    director: "María Solís",
    cast: ["Daniel Ortega", "Lucía Vega", "Sofía Lira"],
    releaseDate: "2026-10-02",
    languages: ["Spanish"],
    formats: ["2D", "3D"],
    prices: ["$8.00", "$11.50"],
    averageRating: "4.2/5",
  },
  {
    id: "3",
    title: "Las Crónicas del Espejo",
    genre: "Terror",
    rating: "NAPTP",
    status: "now-playing",
    posterUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=1200&auto=format&fit=crop&q=80",
    featured: false,
    duration: "105 min",
    synopsis: "Cuando un portal antiguo se abre a través de una reliquia familiar, una joven debe enfrentar sus peores pesadillas hechas realidad.",
    showtimes: ["16:15", "19:00", "22:00"],
    trailerUrl: "https://www.youtube.com/embed/2x-5KJ8FxHo?autoplay=1&mute=1&controls=0&loop=1&playlist=2x-5KJ8FxHo",
    director: "Nadia Flores",
    cast: ["Eva Moreno", "Tomás Ríos", "Clara Vega"],
    releaseDate: "2026-08-29",
    languages: ["Spanish", "English"],
    formats: ["2D", "4DX"],
    prices: ["$7.50", "$12.00"],
    averageRating: "4.0/5",
  },
  {
    id: "4",
    title: "Bajo la Luz de Neón",
    genre: "Thriller",
    rating: "+18",
    status: "now-playing",
    posterUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200&auto=format&fit=crop&q=80",
    featured: true,
    duration: "124 min",
    synopsis: "Un detective atormentado por su pasado se ve envuelto en una red de conspiraciones y traiciones en el corazón nocturno de la ciudad.",
    showtimes: ["14:00", "17:15", "20:30"],
    trailerUrl: "https://www.youtube.com/embed/6ZfuNTqbHE8?autoplay=1&mute=1&controls=0&loop=1&playlist=6ZfuNTqbHE8",
    director: "Javier Cárdenas",
    cast: ["Luis Peña", "Mara Torres", "Bruno Salas"],
    releaseDate: "2026-07-10",
    languages: ["Spanish"],
    formats: ["2D", "IMAX"],
    prices: ["$8.50", "$12.50"],
    averageRating: "4.4/5",
  },
  {
    id: "5",
    title: "Retorno a la Inocencia",
    genre: "Drama",
    rating: "familiar",
    status: "now-playing",
    posterUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80",
    featured: false,
    duration: "118 min",
    synopsis: "Una mujer redescubre sus raíces y la importancia del perdón familiar al regresar a la hacienda donde pasó su infancia.",
    showtimes: ["15:30", "18:00", "20:45"],
    trailerUrl: "https://www.youtube.com/embed/l2s2vLw2314?autoplay=1&mute=1&controls=0&loop=1&playlist=l2s2vLw2314",
    director: "Elena Domínguez",
    cast: ["Sofía Ruiz", "Andrés Mena", "Patricia Lazo"],
    releaseDate: "2026-11-14",
    languages: ["Spanish"],
    formats: ["2D"],
    prices: ["$7.00"],
    averageRating: "4.1/5",
  },
  {
    id: "6",
    title: "En la Sombra del Bosque",
    genre: "Terror",
    rating: "NAPTP",
    status: "coming-soon",
    posterUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=600&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=1200&auto=format&fit=crop&q=80",
    featured: false,
    duration: "98 min",
    synopsis: "Un campamento de verano se convierte en una lucha de supervivencia cuando una presencia ancestral despierta entre los árboles.",
    showtimes: ["18:00", "20:30", "23:00"],
    trailerUrl: "https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1&mute=1&controls=0&loop=1&playlist=5qap5aO4i9A",
    director: "Diego Arrieta",
    cast: ["Paula Rojas", "Mateo Vidal", "Cecilia Ponce"],
    releaseDate: "2026-12-05",
    languages: ["Spanish", "English"],
    formats: ["2D", "4DX"],
    prices: ["$8.00", "$13.50"],
    averageRating: "3.9/5",
  },
  {
    id: "7",
    title: "Velocidad Terminal",
    genre: "Acción",
    rating: "+15",
    status: "coming-soon",
    posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&auto=format&fit=crop&q=80",
    featured: false,
    duration: "135 min",
    synopsis: "Un corredor de élite retirado es forzado a realizar una última entrega a alta velocidad a través de una metrópolis sitiada.",
    showtimes: ["13:00", "16:00", "19:00"],
    trailerUrl: "https://www.youtube.com/embed/6hB3S9bIaco?autoplay=1&mute=1&controls=0&loop=1&playlist=6hB3S9bIaco",
    director: "Alex Rivera",
    cast: ["Carlos Méndez", "Alicia Flores", "Nico Torres"],
    releaseDate: "2026-09-26",
    languages: ["Spanish", "English"],
    formats: ["2D", "IMAX"],
    prices: ["$9.00", "$13.50"],
    averageRating: "4.3/5",
  },
  {
    id: "8",
    title: "Gravedad Cero: Misión Alfa",
    genre: "Sci-Fi",
    rating: "familiar",
    status: "coming-soon",
    posterUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80",
    featured: true,
    duration: "110 min",
    synopsis: "La tripulación de la estación internacional debe improvisar un escape desesperado cuando una lluvia imprevista de basura espacial destruye sus naves de retorno.",
    showtimes: ["14:30", "17:30", "20:30"],
    trailerUrl: "https://www.youtube.com/embed/2LqzF5WauAw?autoplay=1&mute=1&controls=0&loop=1&playlist=2LqzF5WauAw",
    director: "Lina Ortega",
    cast: ["Jonas Pike", "Mina Brooks", "David Chen"],
    releaseDate: "2026-10-30",
    languages: ["English", "Spanish"],
    formats: ["2D", "3D", "IMAX"],
    prices: ["$10.00", "$14.00", "$18.00"],
    averageRating: "4.6/5",
  },
  {
    id: "9",
    title: "Dune: Profecía Cósmica",
    genre: "Sci-Fi",
    rating: "+15",
    status: "now-playing",
    posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80",
    featured: true,
    duration: "166 min",
    synopsis: "Siglos antes de la ascensión de Paul Atreides, dos hermanas Harkonnen combaten a fuerzas oscuras que amenazan el futuro de la humanidad y establecen la secta legendaria Bene Gesserit.",
    showtimes: ["15:00", "18:45", "22:15"],
    trailerUrl: "https://www.youtube.com/embed/Way9Dexny3w?autoplay=1&mute=1&controls=0&loop=1&playlist=Way9Dexny3w",
    director: "Denis Villeneuve",
    cast: ["Emily Watson", "Olivia Williams", "Jodhi May"],
    releaseDate: "2026-09-01",
    languages: ["English", "Spanish"],
    formats: ["IMAX 3D", "2D Dinámica", "Dolby Atmos"],
    prices: ["$11.00", "$16.00", "$19.50"],
    averageRating: "4.9/5",
  },
  {
    id: "10",
    title: "Ciberpunk 2088: Sombras de Neón",
    genre: "Acción",
    rating: "+18",
    status: "now-playing",
    posterUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
    featured: false,
    duration: "138 min",
    synopsis: "En una megalópolis gobernada por megacorporaciones de biotecnología, un mercenario mejorado cibernéticamente acepta un contrato para robar un prototipo de memoria artificial que contiene secretos militares.",
    showtimes: ["16:00", "19:15", "22:30"],
    trailerUrl: "https://www.youtube.com/embed/qIcTM8WXFjk?autoplay=1&mute=1&controls=0&loop=1&playlist=qIcTM8WXFjk",
    director: "Katsuhiro Otomo",
    cast: ["Kenji Sato", "Ren Amari", "Elena Vance"],
    releaseDate: "2026-09-05",
    languages: ["Japanese", "Spanish", "English"],
    formats: ["4DX 3D", "2D", "VIP Lounge"],
    prices: ["$9.50", "$14.50", "$18.00"],
    averageRating: "4.7/5",
  },
  {
    id: "11",
    title: "Sinfonía en la Penumbra",
    genre: "Drama",
    rating: "familiar",
    status: "now-playing",
    posterUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1200&auto=format&fit=crop&q=80",
    featured: false,
    duration: "128 min",
    synopsis: "La apasionante y tormentosa historia de una prodigiosa directora de orquesta que lucha contra la pérdida progresiva de su audición mientras compone su obra maestra póstuma.",
    showtimes: ["14:15", "17:30", "20:45"],
    trailerUrl: "https://www.youtube.com/embed/aqz-KE-bpKQ?autoplay=1&mute=1&controls=0&loop=1&playlist=aqz-KE-bpKQ",
    director: "Todd Field",
    cast: ["Cate Blanchett", "Mark Strong", "Noémie Merlant"],
    releaseDate: "2026-08-20",
    languages: ["English", "Spanish"],
    formats: ["Dolby Atmos", "2D"],
    prices: ["$8.50", "$12.00"],
    averageRating: "4.8/5",
  },
  {
    id: "12",
    title: "El Legado de los Dioses",
    genre: "Acción",
    rating: "+15",
    status: "coming-soon",
    posterUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?w=1200&auto=format&fit=crop&q=80",
    featured: false,
    duration: "142 min",
    synopsis: "Arqueólogos en las profundidades de la cordillera andina descubren una fortaleza milenaria construida por una civilización extraterrestre con la clave para salvar al planeta de una catástrofe solar.",
    showtimes: ["15:30", "18:30", "21:30"],
    trailerUrl: "https://www.youtube.com/embed/6ZfuNTqbHE8?autoplay=1&mute=1&controls=0&loop=1&playlist=6ZfuNTqbHE8",
    director: "Guillermo del Toro",
    cast: ["Oscar Isaac", "Pedro Pascal", "Salma Hayek"],
    releaseDate: "2026-11-12",
    languages: ["Spanish", "English"],
    formats: ["IMAX 3D", "4DX 2D", "Estándar"],
    prices: ["$10.50", "$15.00", "$18.50"],
    averageRating: "4.7/5",
  },
  {
    id: "13",
    title: "Ecos del Silencio",
    genre: "Thriller",
    rating: "+15",
    status: "coming-soon",
    posterUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
    featured: false,
    duration: "115 min",
    synopsis: "Una analista de frecuencias sonoras de la policía intercepta un misterioso audio encriptado durante una investigación rutinaria, convirtiéndose en el blanco de una organización secreta.",
    showtimes: ["16:30", "19:00", "21:45"],
    trailerUrl: "https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1&mute=1&controls=0&loop=1&playlist=ScMzIvxBSi4",
    director: "David Fincher",
    cast: ["Rooney Mara", "Michael Fassbender", "Tilda Swinton"],
    releaseDate: "2026-11-28",
    languages: ["English", "Spanish"],
    formats: ["2D", "Dolby Atmos"],
    prices: ["$9.00", "$13.00"],
    averageRating: "4.5/5",
  },
  {
    id: "14",
    title: "La Maldición de Blackwood",
    genre: "Terror",
    rating: "NAPTP",
    status: "coming-soon",
    posterUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=600&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200&auto=format&fit=crop&q=80",
    featured: false,
    duration: "104 min",
    synopsis: "Un grupo de documentalistas se adentra en un orfanato victoriano clausurado hace más de un siglo para filmar una sesión de espiritismo que desatará entidades que nunca debieron ser perturbadas.",
    showtimes: ["19:00", "21:30", "23:59"],
    trailerUrl: "https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1&mute=1&controls=0&loop=1&playlist=5qap5aO4i9A",
    director: "James Wan",
    cast: ["Patrick Wilson", "Vera Farmiga", "Taissa Farmiga"],
    releaseDate: "2026-10-31",
    languages: ["English", "Spanish"],
    formats: ["2D", "4DX"],
    prices: ["$8.50", "$13.50"],
    averageRating: "4.3/5",
  }
];
