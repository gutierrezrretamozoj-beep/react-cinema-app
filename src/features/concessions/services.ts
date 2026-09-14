import type { CartSnack, Snack, SnackCategory } from "./types";

// Si no se configura la API, la pantalla usa los datos demo del archivo.
const API_URL = import.meta.env.VITE_API_URL ?? "";

// Categorias usadas cuando la API no esta disponible
const demoCategories: SnackCategory[] = [
  { id: "all", name: "Todos los productos" },
  { id: "combos", name: "Combos Especiales" },
  { id: "snacks", name: "Crispetas y Snacks" },
  { id: "drinks", name: "Bebidas Frias" },
  { id: "sweets", name: "Chocolates y Dulces" },
];

export const demoSnacks: Snack[] = [
  {
    id: "combo-01",
    name: "Combo Pareja CineMax",
    description: "Crispetas gigantes de mantequilla, 2 gaseosas grandes y nachos con queso cheddar caliente.",
    image: "https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=800&auto=format&fit=crop&q=80",
    price: 14.50,
    categoryId: "combos",
    available: true,
    promotion: "Mas vendido",
    discount: 15
  },
  {
    id: "combo-02",
    name: "Combo Mega Familiar",
    description: "2 crispetas familiares, 4 bebidas grandes a eleccion y 2 hot dogs con queso fundido.",
    image: "https://images.unsplash.com/photo-1578849278619-1cf77896c4d5?w=800&auto=format&fit=crop&q=80",
    price: 22.00,
    categoryId: "combos",
    available: true,
    promotion: "Ahorro familiar",
    discount: 20
  },
  {
    id: "combo-03",
    name: "Combo Individual Express",
    description: "Crispetas medianas crujientes con sal y mantequilla mas bebida personal de 600ml.",
    image: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=800&auto=format&fit=crop&q=80",
    price: 8.50,
    categoryId: "combos",
    available: true,
    promotion: "Popular"
  },
  {
    id: "snack-01",
    name: "Crispetas Clásicas de Mantequilla",
    description: "Elaboradas al instante con maiz premium y bano de mantequilla dorada tradicional de cine.",
    image: "https://images.unsplash.com/photo-1578849278619-1cf77896c4d5?w=800&auto=format&fit=crop&q=80",
    price: 6.50,
    categoryId: "snacks",
    available: true,
    promotion: "Crujientes"
  },
  {
    id: "snack-02",
    name: "Crispetas Acarameladas Gourmet",
    description: "Palomitas cubiertas con una capa crocante de caramelo artesanal dulce y dorado.",
    image: "https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?w=800&auto=format&fit=crop&q=80",
    price: 7.00,
    categoryId: "snacks",
    available: true,
    promotion: "Dulce"
  },
  {
    id: "snack-03",
    name: "Nachos Supremos con Queso",
    description: "Totopos de maiz crocantes acompanados de salsa de queso cheddar fundido y jalapenos opcionales.",
    image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=800&auto=format&fit=crop&q=80",
    price: 6.00,
    categoryId: "snacks",
    available: true
  },
  {
    id: "snack-04",
    name: "Hot Dog Especial Americano",
    description: "Salchicha premium asada, pan suave brioche, papitas fosforo y salsas de la casa.",
    image: "https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=800&auto=format&fit=crop&q=80",
    price: 5.50,
    categoryId: "snacks",
    available: true
  },
  {
    id: "drink-01",
    name: "Gaseosa Gigante Helada",
    description: "Vaso de 32oz con hielo frappee. Sabores: Coca-Cola, Cuatro, Sprite o Manzana.",
    image: "https://images.unsplash.com/photo-1629203849820-fdd70d49c38e?w=800&auto=format&fit=crop&q=80",
    price: 3.50,
    categoryId: "drinks",
    available: true
  },
  {
    id: "drink-02",
    name: "Granizado ICEE Cereza y Mora",
    description: "Bebida congelada ultra refrescante de doble sabor frutal con burbujas de frescura.",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80",
    price: 4.50,
    categoryId: "drinks",
    available: true,
    promotion: "Frio extremo"
  },
  {
    id: "sweet-01",
    name: "Mix de Chocolates y Gomitas",
    description: "Paquete surtido de confites, chocolates crujientes y gomitas dulces para acompanar la pelicula.",
    image: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=800&auto=format&fit=crop&q=80",
    price: 4.00,
    categoryId: "sweets",
    available: true,
    promotion: "2x1 Dulce",
    discount: 25
  },
];

// Hace una peticion GET y transforma la respuesta en el tipo solicitado.
async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) throw new Error(`GET ${path} failed`);
  return response.json() as Promise<T>;
}

// Carga productos y categorias al abrir la pantalla.
// Si la API falla, devuelve informacion demo para que la vista siga funcionando.
export async function loadConcessions() {
  if (!API_URL) return { snacks: demoSnacks, categories: demoCategories };
  try {
    const [snacks, categories] = await Promise.all([
      get<Snack[]>('/snacks'),
      get<SnackCategory[]>('/snacks/categories'),
    ]);
    return { snacks, categories: [{ id: "all", name: "Todos" }, ...categories] };
  } catch {
    return { snacks: demoSnacks, categories: demoCategories };
  }
}

// Agrega un producto nuevo al carrito del usuario.
export async function addSnack(snack: Snack, quantity: number): Promise<void> {
  if (!API_URL) return;
  await fetch(`${API_URL}/cart/snacks`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ snackId: snack.id, quantity }) });
}

// Cambia la cantidad de un producto que ya esta en el carrito.
export async function updateSnack(snack: CartSnack): Promise<void> {
  if (!API_URL) return;
  await fetch(`${API_URL}/cart/snacks`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ snackId: snack.id, quantity: snack.quantity }) });
}

// Elimina un producto del carrito.
export async function removeSnack(snackId: string): Promise<void> {
  if (!API_URL) return;
  await fetch(`${API_URL}/cart/snacks`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ snackId }),
  });
}