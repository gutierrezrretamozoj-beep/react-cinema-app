export type MovieRating = 'familiar' | '+15' | '+18' | 'NAPTP';
export type MovieGenre = 'Acción' | 'Animación' | 'Aventura' | 'Comedia' | 'Documental' | 'Drama' | 'Sci-Fi' | 'Terror' | 'Thriller';

// Movie: Interfaz para definir el modelo de datos de una película
export interface Movie {
  id: string;
  title: string;
  genre: MovieGenre;
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
        badgeClass: 'bg-badge-familiar/15 text-badge-familiar border border-badge-familiar/30',
        badgeBg: 'bg-badge-familiar/15',
        badgeText: 'text-badge-familiar',
        badgeBorder: 'border-badge-familiar/30',
      };
    case '+15':
    case 'B':
    case 'B15':
      return {
        label: '+15',
        badgeClass: 'bg-badge-15/15 text-badge-15 border border-badge-15/30',
        badgeBg: 'bg-badge-15/15',
        badgeText: 'text-badge-15',
        badgeBorder: 'border-badge-15/30',
      };
    case '+18':
    case 'C':
      return {
        label: '+18',
        badgeClass: 'bg-badge-18/15 text-badge-18 border border-badge-18/30',
        badgeBg: 'bg-badge-18/15',
        badgeText: 'text-badge-18',
        badgeBorder: 'border-badge-18/30',
      };
    case 'NAPTP':
      return {
        label: 'NAPTP',
        badgeClass: 'bg-badge-naptp/15 text-badge-naptp border border-badge-naptp/30',
        badgeBg: 'bg-badge-naptp/15',
        badgeText: 'text-badge-naptp',
        badgeBorder: 'border-badge-naptp/30',
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
    title: "Interstellar",
    genre: "Sci-Fi",
    rating: "familiar",
    status: "now-playing",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_SX600.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
    featured: true,
    duration: "169 min",
    synopsis: "Al ver que la Tierra se está volviendo inhabitable, un grupo de científicos y pilotos viaja a través de un agujero de gusano en busca de un nuevo hogar para la humanidad.",
    showtimes: ["14:30", "17:45", "21:00"],
    trailerUrl: "https://www.youtube.com/embed/zSWdZVtXT7E?autoplay=1&mute=1&controls=0&loop=1&playlist=zSWdZVtXT7E",
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Michael Caine"],
    releaseDate: "2014-11-07",
    languages: ["Subtitulada", "Doblada"],
    formats: ["2D", "IMAX", "4DX"],
    prices: ["$9.50", "$14.50"],
    averageRating: "4.9/5",
  },
  {
    id: "2",
    title: "Oppenheimer",
    genre: "Drama",
    rating: "+15",
    status: "now-playing",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BN2JkMDc5MGQtZjg3YS00NmFiLWIyZmQtZTJmNTM5MjVmYTQ4XkEyXkFqcGc@._V1_SX600.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/nb3xI8XI3w4pMVZ38VijbsyBqP4.jpg",
    featured: true,
    duration: "180 min",
    synopsis: "La historia del físico estadounidense J. Robert Oppenheimer, al frente del Proyecto Manhattan y los ensayos nucleares para construir la primera bomba atómica de la historia.",
    showtimes: ["15:00", "18:30", "21:30"],
    trailerUrl: "https://www.youtube.com/embed/uYPbbksJxIg?autoplay=1&mute=1&controls=0&loop=1&playlist=uYPbbksJxIg",
    director: "Christopher Nolan",
    cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr."],
    releaseDate: "2023-07-21",
    languages: ["Subtitulada", "Doblada"],
    formats: ["2D", "IMAX"],
    prices: ["$9.50", "$14.50"],
    averageRating: "4.8/5",
  },
  {
    id: "3",
    title: "Dune: Parte Dos",
    genre: "Sci-Fi",
    rating: "+15",
    status: "now-playing",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNTc0YmQxMjEtODI5MC00NjFiLTlkMWUtOGQ5NjFmYWUyZGJhXkEyXkFqcGc@._V1_SX600.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/eZ239CUp1d6OryZEBPnO2n87gMG.jpg",
    featured: true,
    duration: "166 min",
    synopsis: "Paul Atreides se une a Chani y a los Fremen mientras busca venganza contra los conspiradores que destruyeron a su familia. Ante una encrucijada, debe evitar un destino catastrófico.",
    showtimes: ["16:15", "19:00", "22:00"],
    trailerUrl: "https://www.youtube.com/embed/Way9Dexny3w?autoplay=1&mute=1&controls=0&loop=1&playlist=Way9Dexny3w",
    director: "Denis Villeneuve",
    cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Javier Bardem"],
    releaseDate: "2024-03-01",
    languages: ["Subtitulada", "Doblada"],
    formats: ["2D", "IMAX", "3D"],
    prices: ["$9.50", "$14.50"],
    averageRating: "4.9/5",
  },
  {
    id: "4",
    title: "El Conjuro",
    genre: "Terror",
    rating: "NAPTP",
    status: "now-playing",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMTM3NjA1NDMyMV5BMl5BanBnXkFtZTcwMDQzNDMzOQ@@._V1_SX600.jpg",
    backdropUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=1200&auto=format&fit=crop&q=80",
    featured: false,
    duration: "112 min",
    synopsis: "Los investigadores de fenómenos paranormales Ed y Lorraine Warren viajan a Rhode Island para ayudar a una familia que presencia fenómenos aterradores en su solitaria granja.",
    showtimes: ["14:00", "17:15", "20:30"],
    trailerUrl: "https://www.youtube.com/embed/k10ETZ41q5o?autoplay=1&mute=1&controls=0&loop=1&playlist=k10ETZ41q5o",
    director: "James Wan",
    cast: ["Patrick Wilson", "Vera Farmiga", "Lili Taylor", "Ron Livingston"],
    releaseDate: "2013-07-19",
    languages: ["Subtitulada", "Doblada"],
    formats: ["2D", "4DX"],
    prices: ["$8.50", "$12.50"],
    averageRating: "4.5/5",
  },
  {
    id: "5",
    title: "The Batman",
    genre: "Acción",
    rating: "+15",
    status: "now-playing",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMmU5NGJlMzAtMGNmOC00YjJjLTgyMzUtNjAyYmE4Njg5YWMyXkEyXkFqcGc@._V1_SX600.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
    featured: true,
    duration: "176 min",
    synopsis: "En su segundo año combatiendo el crimen, Batman desenmascara la corrupción en Gotham City que conecta con su propia familia mientras persigue al despiadado asesino serial el Acertijo.",
    showtimes: ["15:30", "18:00", "20:45"],
    trailerUrl: "https://www.youtube.com/embed/mqqft2x_Aa4?autoplay=1&mute=1&controls=0&loop=1&playlist=mqqft2x_Aa4",
    director: "Matt Reeves",
    cast: ["Robert Pattinson", "Zoë Kravitz", "Paul Dano", "Colin Farrell"],
    releaseDate: "2022-03-04",
    languages: ["Subtitulada", "Doblada"],
    formats: ["2D", "IMAX"],
    prices: ["$9.50", "$14.50"],
    averageRating: "4.7/5",
  },
  {
    id: "6",
    title: "Parásitos",
    genre: "Thriller",
    rating: "+15",
    status: "now-playing",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BYjk1Y2U4MjQtY2ZiNS00OWQyLWI3MmYtZWUwNmRjYWRiNWNhXkEyXkFqcGc@._V1_SX600.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg",
    featured: false,
    duration: "132 min",
    synopsis: "Una familia con ingenio se infiltra poco a poco en la adinerada residencia de los Park. Pero un inesperado giro en el sótano desencadenará una caótica confrontación.",
    showtimes: ["18:00", "20:30", "23:00"],
    trailerUrl: "https://www.youtube.com/embed/5xH0HfJhsaY?autoplay=1&mute=1&controls=0&loop=1&playlist=5xH0HfJhsaY",
    director: "Bong Joon-ho",
    cast: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong", "Choi Woo-shik"],
    releaseDate: "2019-11-08",
    languages: ["Subtitulada"],
    formats: ["2D"],
    prices: ["$8.50", "$12.00"],
    averageRating: "4.9/5",
  },
  {
    id: "7",
    title: "Gladiador II",
    genre: "Acción",
    rating: "+15",
    status: "coming-soon",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMWYzZTM5ZGQtOGE5My00NmM2LWFlMDEtMGNjYjdmOWM1MzA1XkEyXkFqcGc@._V1_SX600.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/tOqIwliWMovSIZ9DyvHcHI7p2im.jpg",
    featured: false,
    duration: "148 min",
    synopsis: "Años después de la muerte de Máximo, Lucio entra al Coliseo tras ver cómo los tiránicos emperadores de Roma conquistan su hogar. Con el honor en juego, luchará por devolver la gloria a Roma.",
    showtimes: ["13:00", "16:00", "19:00"],
    trailerUrl: "https://www.youtube.com/embed/4rgYUipGJNo?autoplay=1&mute=1&controls=0&loop=1&playlist=4rgYUipGJNo",
    director: "Ridley Scott",
    cast: ["Paul Mescal", "Pedro Pascal", "Denzel Washington", "Connie Nielsen"],
    releaseDate: "2024-11-22",
    languages: ["Subtitulada", "Doblada"],
    formats: ["2D", "IMAX"],
    prices: ["$9.50", "$14.50"],
    averageRating: "4.6/5",
  },
  {
    id: "8",
    title: "Alien: Romulus",
    genre: "Terror",
    rating: "NAPTP",
    status: "coming-soon",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMDU0NjcwOGQtNjNjOS00NzQ3LWIwM2YtYWVmODZjMzQzN2ExXkEyXkFqcGc@._V1_SX600.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/cHlLlrhbwA1xxjVBpH47Xj4h3lx.jpg",
    featured: true,
    duration: "119 min",
    synopsis: "En una estación espacial abandonada, un grupo de jóvenes colonizadores espaciales busca provisiones solo para encontrarse cara a cara con la forma de vida más aterradora del universo.",
    showtimes: ["14:30", "17:30", "20:30"],
    trailerUrl: "https://www.youtube.com/embed/x0XDEhP4MQs?autoplay=1&mute=1&controls=0&loop=1&playlist=x0XDEhP4MQs",
    director: "Fede Álvarez",
    cast: ["Cailee Spaeny", "David Jonsson", "Archie Renaux", "Isabela Merced"],
    releaseDate: "2024-08-16",
    languages: ["Subtitulada", "Doblada"],
    formats: ["2D", "3D", "IMAX", "4DX"],
    prices: ["$9.50", "$14.50"],
    averageRating: "4.5/5",
  },
  {
    id: "9",
    title: "Spider-Man: A Través del Spider-Verso",
    genre: "Animación",
    rating: "familiar",
    status: "now-playing",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNThiZjA3MjItZGY5Ni00ZmJhLWEwN2EtOTBlYTA4Y2E0M2ZmXkEyXkFqcGc@._V1_SX600.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg",
    featured: true,
    duration: "140 min",
    synopsis: "Miles Morales es catapultado a través del Multiverso, uniendo fuerzas con Gwen Stacy y un equipo de élite para proteger su existencia mientras redefine lo que significa ser un héroe.",
    showtimes: ["15:00", "18:45", "22:15"],
    trailerUrl: "https://www.youtube.com/embed/cqGjhVJWtEg?autoplay=1&mute=1&controls=0&loop=1&playlist=cqGjhVJWtEg",
    director: "Joaquim Dos Santos, Kemp Powers",
    cast: ["Shameik Moore", "Hailee Steinfeld", "Oscar Isaac", "Daniel Kaluuya"],
    releaseDate: "2023-06-02",
    languages: ["Subtitulada", "Doblada"],
    formats: ["2D", "IMAX", "4DX"],
    prices: ["$9.50", "$14.50"],
    averageRating: "4.9/5",
  },
  {
    id: "10",
    title: "Joker",
    genre: "Drama",
    rating: "+18",
    status: "now-playing",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNzY3OWQ5NDktNWQ2OC00ZjdlLThkMmItMDhhNDk3NTFiZGU4XkEyXkFqcGc@._V1_SX600.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg",
    featured: false,
    duration: "122 min",
    synopsis: "Arthur Fleck, un payaso ignorado y maltratado por la sociedad en una caótica Gotham, desciende a una espiral de violencia y locura hasta convertirse en el Guasón.",
    showtimes: ["16:00", "19:15", "22:30"],
    trailerUrl: "https://www.youtube.com/embed/zAGVQLHvwOY?autoplay=1&mute=1&controls=0&loop=1&playlist=zAGVQLHvwOY",
    director: "Todd Phillips",
    cast: ["Joaquin Phoenix", "Robert De Niro", "Zazie Beetz", "Frances Conroy"],
    releaseDate: "2019-10-04",
    languages: ["Subtitulada", "Doblada"],
    formats: ["2D", "IMAX"],
    prices: ["$8.50", "$13.50"],
    averageRating: "4.8/5",
  },
  {
    id: "11",
    title: "El Origen (Inception)",
    genre: "Sci-Fi",
    rating: "+15",
    status: "coming-soon",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX600.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
    featured: false,
    duration: "148 min",
    synopsis: "Dom Cobb es un maestro en el arte de la extracción: robar valiosos secretos de las profundidades del subconsciente durante los sueños. Ahora debe lograr lo imposible: implantar una idea.",
    showtimes: ["14:15", "17:30", "20:45"],
    trailerUrl: "https://www.youtube.com/embed/YoHD9XEInc0?autoplay=1&mute=1&controls=0&loop=1&playlist=YoHD9XEInc0",
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page", "Tom Hardy"],
    releaseDate: "2010-07-16",
    languages: ["Subtitulada", "Doblada"],
    formats: ["2D", "IMAX"],
    prices: ["$9.50", "$14.50"],
    averageRating: "4.9/5",
  },
  {
    id: "12",
    title: "Un Lugar en Silencio: Día Uno",
    genre: "Terror",
    rating: "+15",
    status: "coming-soon",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMDdjZTljZWMtMDIwNi00MTA5LTkxZmItNmY0NDA3ZDM0N2M2XkEyXkFqcGc@._V1_SX600.jpg",
    backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
    featured: false,
    duration: "99 min",
    synopsis: "Experimenta el día en que el mundo quedó en completo silencio. Sam debe sobrevivir al colapso de la ruidosa ciudad de Nueva York tras la invasión de depredadores alienígenas con oído hipersensible.",
    showtimes: ["15:30", "18:30", "21:30"],
    trailerUrl: "https://www.youtube.com/embed/YPY7J-flzE8?autoplay=1&mute=1&controls=0&loop=1&playlist=YPY7J-flzE8",
    director: "Michael Sarnoski",
    cast: ["Lupita Nyong'o", "Joseph Quinn", "Alex Wolff", "Djimon Hounsou"],
    releaseDate: "2024-06-28",
    languages: ["Subtitulada", "Doblada"],
    formats: ["2D", "4DX"],
    prices: ["$9.00", "$13.50"],
    averageRating: "4.3/5",
  },
  {
    id: "13",
    title: "Intensamente 2",
    genre: "Animación",
    rating: "familiar",
    status: "now-playing",
    posterUrl: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/xg270UXie02N02IZHmStkiZGPPz.jpg",
    featured: true,
    duration: "96 min",
    synopsis: "Riley entra en la adolescencia y su cuartel general sufre una repentina demolición para dar paso a algo totalmente inesperado: ¡nuevas emociones como Ansiedad, Envidia y Vergüenza!",
    showtimes: ["14:00", "16:30", "19:00"],
    trailerUrl: "https://www.youtube.com/embed/LEjhY15eCx0?autoplay=1&mute=1&controls=0&loop=1&playlist=LEjhY15eCx0",
    director: "Kelsey Mann",
    cast: ["Amy Poehler", "Maya Hawke", "Kensington Tallman", "Liza Lapira"],
    releaseDate: "2024-06-14",
    languages: ["Doblada", "Subtitulada"],
    formats: ["2D", "3D"],
    prices: ["$8.50", "$12.50"],
    averageRating: "4.8/5",
  },
  {
    id: "14",
    title: "Planeta Salvaje: Océanos",
    genre: "Documental",
    rating: "familiar",
    status: "now-playing",
    posterUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=900&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=1280&auto=format&fit=crop&q=80",
    featured: false,
    duration: "89 min",
    synopsis: "Una fascinante expedición visual submarina que explora los ecosistemas marítimos más remotos y los secretos mejor guardados de las profundidades del océano.",
    showtimes: ["15:15", "18:00"],
    trailerUrl: "https://www.youtube.com/embed/aETNYyrqNYE?autoplay=1&mute=1&controls=0&loop=1",
    director: "David Attenborough Team",
    cast: ["David Attenborough (Narración)"],
    releaseDate: "2024-04-22",
    languages: ["Subtitulada", "Doblada"],
    formats: ["2D", "IMAX"],
    prices: ["$7.50", "$11.00"],
    averageRating: "4.9/5",
  },
  {
    id: "15",
    title: "Deadpool & Wolverine",
    genre: "Comedia",
    rating: "+18",
    status: "now-playing",
    posterUrl: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg",
    featured: true,
    duration: "128 min",
    synopsis: "Un apático Wade Wilson se esfuerza por adaptarse a la vida civil, pero cuando su mundo enfrenta una amenaza existencial, debe convencer a un reacio Wolverine de unirse a la batalla.",
    showtimes: ["16:45", "19:30", "22:15"],
    trailerUrl: "https://www.youtube.com/embed/73_1biulkYk?autoplay=1&mute=1&controls=0&loop=1&playlist=73_1biulkYk",
    director: "Shawn Levy",
    cast: ["Ryan Reynolds", "Hugh Jackman", "Emma Corrin", "Matthew Macfadyen"],
    releaseDate: "2024-07-26",
    languages: ["Subtitulada", "Doblada"],
    formats: ["2D", "IMAX", "4DX"],
    prices: ["$9.50", "$14.50"],
    averageRating: "4.7/5",
  },
];
