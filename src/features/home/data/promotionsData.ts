export interface Promotion {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  category: 'promo' | 'combo' | 'cineclub';
  imageUrl: string;
  backdropUrl: string;
  ctaText: string;
  targetUrl: string;
  terms?: string;
  validUntil?: string;
}

export const PROMOTIONS: Promotion[] = [
  {
    id: "promo-2x1",
    title: "Martes 2x1 en Todas las Salas",
    subtitle: "Duplica la emoción del cine por el mismo precio",
    description: "Aprovecha todos los martes 2x1 en boletas estándar, 3D e IMAX pagando con tarjetas seleccionadas o siendo miembro CineClub.",
    badge: "OFERTA SEMANAL",
    category: "promo",
    imageUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=900&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600&auto=format&fit=crop&q=80",
    ctaText: "Aprovechar 2x1",
    targetUrl: "/movies",
    validUntil: "Todos los martes de 2026",
    terms: "Aplica en taquilla física y reservas en línea. No acumulable con otras promociones.",
  },
  {
    id: "combo-estreno",
    title: "Combo Estreno Dúo: Popcorn + Bebidas",
    subtitle: "El compañero perfecto para tu película",
    description: "Disfruta de 2 palomitas gigantes con mantequilla extra, 2 gaseosas grandes y unos nachos con queso cheddar caliente con 25% de descuento.",
    badge: "CONFITERÍA VIP",
    category: "combo",
    imageUrl: "https://images.unsplash.com/photo-1572177191856-3cde618dee1f?w=900&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=1600&auto=format&fit=crop&q=80",
    ctaText: "Ver Combos",
    targetUrl: "/movies/1/seats",
    validUntil: "Disponible toda la temporada",
    terms: "Puedes agregarlo directamente al seleccionar tus butacas durante el checkout.",
  },
  {
    id: "cineclub-vip",
    title: "Membresía CineClub Black",
    subtitle: "Entradas preferenciales, puntos y salas exclusivas",
    description: "Únete al club de cine más exclusivo. Obtén 2 entradas gratis al mes, preventas 48 horas antes que el público general y refill ilimitado en snacks.",
    badge: "CLUB EXCLUSIVO",
    category: "cineclub",
    imageUrl: "https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=900&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1600&auto=format&fit=crop&q=80",
    ctaText: "Unirme al Club",
    targetUrl: "/auth/register",
    validUntil: "Inscripciones abiertas",
    terms: "Membresía anual con renovación automática y cancelación flexible.",
  }
];
