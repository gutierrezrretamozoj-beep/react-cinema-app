export interface TheaterComplex {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  description: string;
  photos: {
    url: string;
    caption: string;
  }[];
  formats: string[];
  totalRooms: number;
}

export const THEATERS: TheaterComplex[] = [
  {
    id: "viva-barranquilla",
    name: "Multicine Viva Barranquilla",
    city: "Barranquilla",
    address: "Carrera 51B # 87-50 (Piso 4)",
    phone: "+57 (605) 385-2000",
    description: "Complejo insignia dotado con la mayor pantalla IMAX láser de la región, sala 4DX inmersiva y butacas reclinables ultra cómodas.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=800&auto=format&fit=crop&q=80",
        caption: "Fachada & Centro Comercial Viva",
      },
      {
        url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80",
        caption: "Taquilla Digital & Lobby Iluminado",
      },
      {
        url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80",
        caption: "Sala IMAX Laser con Proyección 3D",
      },
    ],
    formats: ["IMAX 3D", "4DX 2D", "Kids 2D", "Estándar"],
    totalRooms: 8,
  },
  {
    id: "buenavista-barranquilla",
    name: "Multiplex Buenavista",
    city: "Barranquilla",
    address: "Calle 98 # 52-115 (C.C. Buenavista II - Piso 3)",
    phone: "+57 (605) 378-5500",
    description: "Experiencia premium en el corazón del norte de la ciudad. Equipado con sonido Dolby Atmos envolvente y barra de confitería gourmet.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1568444438385-eee3366edc00?w=800&auto=format&fit=crop&q=80",
        caption: "Entrada Principal Buenavista",
      },
      {
        url: "https://images.unsplash.com/photo-1572177191856-3cde618dee1f?w=800&auto=format&fit=crop&q=80",
        caption: "Dulcería Gourmet & Popcorn Bar",
      },
      {
        url: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=800&auto=format&fit=crop&q=80",
        caption: "Sala Dinámica con Sonido Atmos",
      },
    ],
    formats: ["2D Dinámica", "Sonido Atmos", "VIP Lounge", "Estándar"],
    totalRooms: 6,
  },
];
