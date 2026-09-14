// Producto que se muestra en el catalogo de concesiones.
export interface Snack {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  categoryId: string;
  categoryName?: string;
  available: boolean;
  promotion?: string;
  discount?: number;
}

// Categoria usada para filtrar los productos.
export interface SnackCategory {
  id: string;
  name: string;
}

// Producto que ya fue agregado al carrito.
export interface CartSnack extends Snack {
  quantity: number;
}