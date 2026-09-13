// src/shared/api/cinemaApi.ts
// Cliente de API nativo utilizando Fetch con soporte de Fallback inteligente (Autocuidado)
// Permite al proyecto correr sin backend (offline) o integrarse automáticamente con json-server (online)

import { MOVIES } from '@/features/auth/pages/Home/data/movieData';
import type { Movie } from '@/features/auth/pages/Home/data/movieData';

export const API_BASE_URL = 'http://localhost:5000';

export interface CinemaFunction {
  id: string;
  movieId: string;
  theater: string;
  roomName: string;
  roomType: 'standard' | 'imax' | '4dx' | 'kids';
  format: string;
  experienceLabel: string;
  language: 'Subtitulada' | 'Doblada';
  date: string;
  time: string;
  rows: string[];
  cols: number;
  occupiedSeats: string[];
}

export interface Reservation {
  id: string;
  movieId: string;
  // Correo del usuario para aislar las reservas por cuenta
  userEmail?: string;
  date: string;
  time: string;
  seats: string[];
  format: string;
  code: string;
  total: number;
}

export interface CartItem {
  id: string;
  type: 'ticket' | 'concession';
  name: string;
  quantity: number;
  unitPrice: number;
  seatId?: string;
  movieId?: string;
  showtime?: string;
}

export interface Cart {
  id: string;
  userEmail: string;
  movieId: string;
  functionId: string;
  movieTitle: string;
  theater: string;
  date: string;
  time: string;
  items: CartItem[];
  membershipDiscount: number;
  giftCardDiscount: number;
  expiresAt: string;
}

export type PaymentMethod = 'credit_card' | 'debit_card' | 'pse' | 'nequi' | 'daviplata';
export type PaymentStatus = 'processing' | 'approved' | 'rejected' | 'pending';

export interface PaymentResult {
  id: string;
  status: PaymentStatus;
  orderId?: string;
  message?: string;
}

export interface OrderData {
  cartId: string;
  userEmail: string;
  total: number;
  paymentId: string;
}

export interface OrderResult extends OrderData {
  id: string;
  createdAt: string;
}

// Almacenamiento y banderas para controlar la conexion con el backend
let localFunctionsCache: CinemaFunction[] = [];
let isServerOnline: boolean | null = null;
let lastServerAttempt = 0;
const SERVER_RETRY_INTERVAL = 60000;

// Determina si debemos intentar la peticion fetch o usar directamente el modo local
const shouldAttemptFetch = (): boolean => {
  if (isServerOnline === false) {
    if (Date.now() - lastServerAttempt < SERVER_RETRY_INTERVAL) {
      return false;
    }
  }
  return true;
};

// Registra que el servidor respondio exitosamente
const markServerSuccess = () => {
  isServerOnline = true;
};

// Registra falla de conexion y activa el modo local para no saturar la consola
const markServerFailure = () => {
  isServerOnline = false;
  lastServerAttempt = Date.now();
};

// El fallback identifica el carrito por usuario para conservar una sola sesion activa local
const readLocalCart = (userEmail: string): Cart | null => {
  const saved = localStorage.getItem(`cinema_cart_${userEmail}`);
  return saved ? JSON.parse(saved) : null;
};

const writeLocalCart = (cart: Cart | null, userEmail: string) => {
  if (cart) localStorage.setItem(`cinema_cart_${userEmail}`, JSON.stringify(cart));
  else localStorage.removeItem(`cinema_cart_${userEmail}`);
};

const DEFAULT_STANDARD_ROWS = ['A', 'B', 'C', 'D', 'E', 'F'];
const DEFAULT_IMAX_ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const initializeLocalCache = () => {
  if (localFunctionsCache.length > 0) return;
  
  const defaultFunctions: CinemaFunction[] = [];
  
  MOVIES.forEach((movie) => {
    // 1. Experiencia 4DX 2D - DOB (Sala 4DX, 48 asientos)
    defaultFunctions.push(
      {
        id: `fn-${movie.id}-4dx-1`,
        movieId: movie.id,
        theater: 'Multicine Viva Barranquilla',
        roomName: 'Sala 4 4DX',
        roomType: '4dx',
        format: '4DX 2D',
        experienceLabel: '4DX 2D - DOB',
        language: 'Doblada',
        date: 'Hoy',
        time: '06:30 p. m.',
        rows: DEFAULT_STANDARD_ROWS,
        cols: 8,
        occupiedSeats: ['A-3', 'A-4', 'B-1', 'C-4'],
      },
      {
        id: `fn-${movie.id}-4dx-2`,
        movieId: movie.id,
        theater: 'Multicine Viva Barranquilla',
        roomName: 'Sala 4 4DX',
        roomType: '4dx',
        format: '4DX 2D',
        experienceLabel: '4DX 2D - DOB',
        language: 'Doblada',
        date: 'Hoy',
        time: '09:30 p. m.',
        rows: DEFAULT_STANDARD_ROWS,
        cols: 8,
        occupiedSeats: ['B-2', 'B-3', 'E-4', 'E-5'],
      }
    );

    // 2. Experiencia Kids 2D - DOB (Sala Kids, 48 asientos)
    defaultFunctions.push({
      id: `fn-${movie.id}-kids-1`,
      movieId: movie.id,
      theater: 'Multicine Viva Barranquilla',
      roomName: 'Sala 2 Kids',
      roomType: 'kids',
      format: 'Kids 2D',
      experienceLabel: 'Kids 2D - DOB',
      language: 'Doblada',
      date: 'Hoy',
      time: '08:20 p. m.',
      rows: DEFAULT_STANDARD_ROWS,
      cols: 8,
      occupiedSeats: ['C-3', 'C-4', 'D-5'],
    });

    // 3. Experiencia IMAX 3D - SUB (Sala 1 IMAX, 80 asientos: 8x10)
    defaultFunctions.push(
      {
        id: `fn-${movie.id}-imax-1`,
        movieId: movie.id,
        theater: 'Multicine Viva Barranquilla',
        roomName: 'Sala 1 IMAX',
        roomType: 'imax',
        format: 'IMAX 3D',
        experienceLabel: 'IMAX 3D - SUB',
        language: 'Subtitulada',
        date: 'Hoy',
        time: '04:00 p. m.',
        rows: DEFAULT_IMAX_ROWS,
        cols: 10,
        occupiedSeats: ['D-4', 'D-5', 'E-5', 'E-6', 'G-1', 'H-10'],
      },
      {
        id: `fn-${movie.id}-imax-2`,
        movieId: movie.id,
        theater: 'Multicine Viva Barranquilla',
        roomName: 'Sala 1 IMAX',
        roomType: 'imax',
        format: 'IMAX 3D',
        experienceLabel: 'IMAX 3D - SUB',
        language: 'Subtitulada',
        date: 'Hoy',
        time: '07:45 p. m.',
        rows: DEFAULT_IMAX_ROWS,
        cols: 10,
        occupiedSeats: ['A-1', 'A-2', 'C-4', 'C-5', 'D-6', 'F-7'],
      }
    );

    // 4. Experiencia 2D General - DOB en otros teatros
    defaultFunctions.push({
      id: `fn-${movie.id}-std-1`,
      movieId: movie.id,
      theater: 'Multiplex Buenavista',
      roomName: 'Sala 3 Dinámica',
      roomType: 'standard',
      format: '2D',
      experienceLabel: '2D General - DOB',
      language: 'Doblada',
      date: 'Hoy',
      time: '05:15 p. m.',
      rows: DEFAULT_STANDARD_ROWS,
      cols: 8,
      occupiedSeats: ['B-4', 'B-5', 'F-1'],
    });

    // 5. Funciones para Mañana (Multicine Viva Barranquilla)
    defaultFunctions.push(
      {
        id: `fn-${movie.id}-manana-imax-1`,
        movieId: movie.id,
        theater: 'Multicine Viva Barranquilla',
        roomName: 'Sala 1 IMAX',
        roomType: 'imax',
        format: 'IMAX 3D',
        experienceLabel: 'IMAX 3D - SUB',
        language: 'Subtitulada',
        date: 'Mañana',
        time: '03:30 p. m.',
        rows: DEFAULT_IMAX_ROWS,
        cols: 10,
        occupiedSeats: ['B-4', 'B-5', 'C-6', 'D-7'],
      },
      {
        id: `fn-${movie.id}-manana-imax-2`,
        movieId: movie.id,
        theater: 'Multicine Viva Barranquilla',
        roomName: 'Sala 1 IMAX',
        roomType: 'imax',
        format: 'IMAX 3D',
        experienceLabel: 'IMAX 3D - SUB',
        language: 'Subtitulada',
        date: 'Mañana',
        time: '07:15 p. m.',
        rows: DEFAULT_IMAX_ROWS,
        cols: 10,
        occupiedSeats: ['B-1', 'B-2', 'C-5', 'C-6', 'E-4', 'E-5'],
      },
      {
        id: `fn-${movie.id}-manana-4dx-1`,
        movieId: movie.id,
        theater: 'Multicine Viva Barranquilla',
        roomName: 'Sala 4 4DX',
        roomType: '4dx',
        format: '4DX 2D',
        experienceLabel: '4DX 2D - DOB',
        language: 'Doblada',
        date: 'Mañana',
        time: '05:45 p. m.',
        rows: DEFAULT_STANDARD_ROWS,
        cols: 8,
        occupiedSeats: ['A-2', 'A-7', 'C-3'],
      }
    );

    // 6. Funciones para Fin de Semana (Sábado 22)
    defaultFunctions.push({
      id: `fn-${movie.id}-sab-imax-1`,
      movieId: movie.id,
      theater: 'Multicine Viva Barranquilla',
      roomName: 'Sala 1 IMAX',
      roomType: 'imax',
      format: 'IMAX 3D',
      experienceLabel: 'IMAX 3D - SUB',
      language: 'Subtitulada',
      date: 'Sábado 22',
      time: '06:00 p. m.',
      rows: DEFAULT_IMAX_ROWS,
      cols: 10,
      occupiedSeats: ['B-1', 'B-2', 'B-3', 'C-4', 'C-5', 'D-5', 'D-6', 'E-5', 'E-6'],
    });
  });

  localFunctionsCache = defaultFunctions;
};

export const cinemaApi = {
  // 1. Obtener Peliculas
  async getMovies(): Promise<Movie[]> {
    if (!shouldAttemptFetch()) {
      return MOVIES;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/movies`, { signal: AbortSignal.timeout(1500) });
      if (!res.ok) throw new Error();
      const data = await res.json();
      markServerSuccess();
      return data;
    } catch {
      markServerFailure();
      return MOVIES;
    }
  },

  // 2. Obtener Funciones por Pelicula
  async getFunctions(movieId: string): Promise<CinemaFunction[]> {
    if (!shouldAttemptFetch()) {
      initializeLocalCache();
      return localFunctionsCache.filter((f) => f.movieId === movieId);
    }
    try {
      const res = await fetch(`${API_BASE_URL}/functions?movieId=${movieId}`, { signal: AbortSignal.timeout(1500) });
      if (!res.ok) throw new Error();
      const data = await res.json();
      
      // Si la consulta del json-server no devolvio ninguna funcion, generamos funciones por defecto
      if (data.length === 0) {
        throw new Error('No functions found, generating default');
      }
      markServerSuccess();
      return data;
    } catch {
      markServerFailure();
      initializeLocalCache();
      return localFunctionsCache.filter((f) => f.movieId === movieId);
    }
  },

  // 3. Bloquear / Liberar Asientos
  async updateOccupiedSeats(functionId: string, seatIds: string[], action: 'lock' | 'release'): Promise<CinemaFunction> {
    if (!shouldAttemptFetch()) {
      initializeLocalCache();
      const idx = localFunctionsCache.findIndex((f) => f.id === functionId);
      if (idx !== -1) {
        let newOccupied = [...localFunctionsCache[idx].occupiedSeats];
        if (action === 'lock') {
          seatIds.forEach(id => {
            if (!newOccupied.includes(id)) newOccupied.push(id);
          });
        } else {
          newOccupied = newOccupied.filter(id => !seatIds.includes(id));
        }
        localFunctionsCache[idx].occupiedSeats = newOccupied;
        return localFunctionsCache[idx];
      }
      throw new Error('Function not found in local cache');
    }

    try {
      // 1. Buscar estado actual
      const getRes = await fetch(`${API_BASE_URL}/functions/${functionId}`);
      if (!getRes.ok) throw new Error();
      const currentFn: CinemaFunction = await getRes.json();

      let newOccupied = [...currentFn.occupiedSeats];
      if (action === 'lock') {
        seatIds.forEach(id => {
          if (!newOccupied.includes(id)) newOccupied.push(id);
        });
      } else {
        newOccupied = newOccupied.filter(id => !seatIds.includes(id));
      }

      // 2. Hacer PATCH al json-server
      const patchRes = await fetch(`${API_BASE_URL}/functions/${functionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ occupiedSeats: newOccupied })
      });
      if (!patchRes.ok) throw new Error();
      markServerSuccess();
      return await patchRes.json();
    } catch {
      markServerFailure();
      initializeLocalCache();
      const idx = localFunctionsCache.findIndex((f) => f.id === functionId);
      if (idx !== -1) {
        let newOccupied = [...localFunctionsCache[idx].occupiedSeats];
        if (action === 'lock') {
          seatIds.forEach(id => {
            if (!newOccupied.includes(id)) newOccupied.push(id);
          });
        } else {
          newOccupied = newOccupied.filter(id => !seatIds.includes(id));
        }
        localFunctionsCache[idx].occupiedSeats = newOccupied;
        return localFunctionsCache[idx];
      }
      throw new Error('Function not found in local cache');
    }
  },

  // 4. Crear Reserva / Ticket
  async createReservation(resData: Omit<Reservation, 'id'>): Promise<Reservation> {
    const newReservation: Reservation = {
      id: Math.random().toString(36).substring(2, 9),
      ...resData
    };

    // Guardado local aislado especificamente para el usuario actual
    const userKey = (resData.userEmail || 'guest').toLowerCase();
    const userStorageKey = `cinema_tickets_${userKey}`;
    const savedUserTickets = localStorage.getItem(userStorageKey);
    const listUser = savedUserTickets ? JSON.parse(savedUserTickets) : [];
    localStorage.setItem(userStorageKey, JSON.stringify([newReservation, ...listUser]));

    // Guardado general por compatibilidad
    const saved = localStorage.getItem('cinema_tickets');
    const list = saved ? JSON.parse(saved) : [];
    localStorage.setItem('cinema_tickets', JSON.stringify([newReservation, ...list]));

    if (!shouldAttemptFetch()) {
      return newReservation;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReservation),
        signal: AbortSignal.timeout(1500)
      });
      if (!res.ok) throw new Error();
      markServerSuccess();
      return await res.json();
    } catch {
      markServerFailure();
      return newReservation;
    }
  },

  async createCart(cartData: Omit<Cart, 'id'>): Promise<Cart> {
    const newCart: Cart = { id: `cart-${Date.now()}`, ...cartData };
    writeLocalCart(newCart, cartData.userEmail);

    if (!shouldAttemptFetch()) {
      return newCart;
    }

    try {
      // Usamos /carts (plural) porque json-server genera el endpoint segun la clave del db.json
      const res = await fetch(`${API_BASE_URL}/carts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCart),
        signal: AbortSignal.timeout(1500),
      });
      if (!res.ok) throw new Error();
      markServerSuccess();
      return await res.json();
    } catch {
      markServerFailure();
      return newCart;
    }
  },

  async getCart(userEmail: string): Promise<Cart | null> {
    if (!shouldAttemptFetch()) {
      return readLocalCart(userEmail);
    }

    try {
      // Usamos /carts (plural) — endpoint real de json-server segun la clave del db.json
      const res = await fetch(`${API_BASE_URL}/carts?userEmail=${encodeURIComponent(userEmail)}`, {
        signal: AbortSignal.timeout(1500),
      });
      if (!res.ok) throw new Error();
      markServerSuccess();
      const carts: Cart[] = await res.json();
      return carts[0] ?? readLocalCart(userEmail);
    } catch {
      markServerFailure();
      return readLocalCart(userEmail);
    }
  },

  async updateCart(cart: Cart): Promise<Cart> {
    writeLocalCart(cart, cart.userEmail);

    if (!shouldAttemptFetch()) {
      return cart;
    }

    try {
      // Usamos /carts (plural) para que coincida con la clave en db.json
      const res = await fetch(`${API_BASE_URL}/carts/${cart.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cart),
        signal: AbortSignal.timeout(1500),
      });
      if (!res.ok) throw new Error();
      markServerSuccess();
      return await res.json();
    } catch {
      markServerFailure();
      return cart;
    }
  },

  async deleteCart(cart: Cart): Promise<void> {
    writeLocalCart(null, cart.userEmail);

    if (!shouldAttemptFetch()) {
      return;
    }

    try {
      // Usamos /carts (plural) para que coincida con la clave en db.json
      const res = await fetch(`${API_BASE_URL}/carts/${cart.id}`, {
        method: 'DELETE',
        signal: AbortSignal.timeout(1500),
      });
      if (!res.ok) throw new Error();
      markServerSuccess();
    } catch {
      markServerFailure();
    }
  },

  async createPayment(paymentData: { cartId: string; method: PaymentMethod; amount: number }): Promise<PaymentResult> {
    const payment: PaymentResult = {
      id: `pay-${Date.now()}`,
      status: paymentData.method === 'pse' ? 'pending' : 'approved',
      message: paymentData.method === 'pse' ? 'Confirma el pago desde tu banco.' : undefined,
    };

    if (!shouldAttemptFetch()) return payment;
    try {
      const res = await fetch(`${API_BASE_URL}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
        signal: AbortSignal.timeout(1500),
      });
      if (!res.ok) throw new Error();
      markServerSuccess();
      return await res.json();
    } catch {
      markServerFailure();
      return payment;
    }
  },

  async getPaymentStatus(paymentId: string): Promise<PaymentResult> {
    if (!shouldAttemptFetch()) return { id: paymentId, status: 'approved' };
    try {
      const res = await fetch(`${API_BASE_URL}/payments/status?paymentId=${encodeURIComponent(paymentId)}`, {
        signal: AbortSignal.timeout(1500),
      });
      if (!res.ok) throw new Error();
      markServerSuccess();
      return await res.json();
    } catch {
      markServerFailure();
      return { id: paymentId, status: 'approved' };
    }
  },

  async createOrder(orderData: OrderData): Promise<OrderResult> {
    const order: OrderResult = { id: `ORD-${Date.now()}`, createdAt: new Date().toISOString(), ...orderData };
    if (!shouldAttemptFetch()) return order;
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
        signal: AbortSignal.timeout(1500),
      });
      if (!res.ok) throw new Error();
      markServerSuccess();
      return await res.json();
    } catch {
      markServerFailure();
      return order;
    }
  },

  async applyMembership(cart: Cart, code: string): Promise<Cart> {
    const discount = code.trim().toUpperCase() === 'NOVA10' ? cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) * 0.1 : 0;
    const updated = { ...cart, membershipDiscount: Math.round(discount * 100) / 100 };
    try {
      const res = await fetch(`${API_BASE_URL}/cart/apply-membership`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartId: cart.id, code }),
        signal: AbortSignal.timeout(1500),
      });
      if (res.ok) return await res.json();
    } catch {
      // Usa el mismo fallback local del resto de operaciones del carrito.
    }
    return this.updateCart(updated);
  },

  async applyGiftcard(cart: Cart, code: string): Promise<Cart> {
    const discount = code.trim().toUpperCase() === 'REGALO25' ? 25 : 0;
    const updated = { ...cart, giftCardDiscount: Math.min(discount, cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)) };
    try {
      const res = await fetch(`${API_BASE_URL}/cart/apply-giftcard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartId: cart.id, code }),
        signal: AbortSignal.timeout(1500),
      });
      if (res.ok) return await res.json();
    } catch {
      // Usa el mismo fallback local del resto de operaciones del carrito.
    }
    return this.updateCart(updated);
  }
};
