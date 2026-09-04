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
  date: string;
  format: string;
  language: string;
  time: string;
  occupiedSeats: string[];
}

export interface Reservation {
  id: string;
  movieId: string;
  date: string;
  time: string;
  seats: string[];
  format: string;
  code: string;
  total: number;
}

// Bandera y almacenamiento interno para simular base de datos local en fallback
let localFunctionsCache: CinemaFunction[] = [];

const initializeLocalCache = () => {
  if (localFunctionsCache.length > 0) return;
  
  // Generamos funciones por defecto basadas en la data estática
  const defaultFunctions: CinemaFunction[] = [];
  MOVIES.forEach((movie) => {
    // Generar funciones para hoy
    movie.showtimes.forEach((time, index) => {
      defaultFunctions.push({
        id: `f-${movie.id}-${index}`,
        movieId: movie.id,
        theater: 'Multiplex Portal',
        date: 'Hoy',
        format: movie.formats?.[0] || 'IMAX',
        language: 'Subtitulada',
        time: time,
        occupiedSeats: getStaticOccupiedSeats(movie.id),
      });
    });
  });
  localFunctionsCache = defaultFunctions;
};

// Asientos ocupados por defecto (para fallback offline)
const getStaticOccupiedSeats = (movieId: string): string[] => {
  const staticOccupations: Record<string, string[]> = {
    "1": ['A-3', 'A-4', 'B-1', 'B-6', 'C-4', 'C-5', 'D-2', 'D-8', 'E-4', 'E-5', 'F-7'],
    "2": ['A-1', 'A-8', 'B-3', 'B-5', 'C-2', 'C-6', 'D-1', 'D-7', 'E-3', 'F-4', 'F-6'],
    "3": ['A-2', 'A-5', 'B-2', 'B-7', 'C-1', 'C-8', 'D-3', 'D-6', 'E-1', 'E-8', 'F-5'],
    "4": ['A-4', 'A-6', 'B-4', 'B-8', 'C-3', 'C-7', 'D-4', 'D-5', 'E-2', 'E-7', 'F-3'],
    "5": ['A-3', 'A-7', 'B-2', 'B-6', 'C-5', 'C-8', 'D-1', 'D-8', 'E-3', 'E-6', 'F-2'],
    "6": ['A-1', 'A-5', 'B-3', 'B-7', 'C-2', 'C-6', 'D-3', 'D-7', 'E-4', 'E-7', 'F-1'],
    "7": ['A-2', 'A-6', 'B-4', 'B-8', 'C-1', 'C-7', 'D-2', 'D-6', 'E-5', 'E-8', 'F-4'],
    "8": ['A-3', 'A-5', 'B-1', 'B-7', 'C-4', 'C-8', 'D-3', 'D-5', 'E-2', 'E-6', 'F-3'],
  };
  return staticOccupations[movieId] ?? staticOccupations["1"];
};

export const cinemaApi = {
  // 1. Obtener Películas
  async getMovies(): Promise<Movie[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/movies`, { signal: AbortSignal.timeout(1500) });
      if (!res.ok) throw new Error();
      const data = await res.json();
      return data;
    } catch {
      console.warn('⚠️ cinemaApi: Conexión con json-server offline. Usando catálogo estático.');
      return MOVIES;
    }
  },

  // 2. Obtener Funciones por Película
  async getFunctions(movieId: string): Promise<CinemaFunction[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/functions?movieId=${movieId}`, { signal: AbortSignal.timeout(1500) });
      if (!res.ok) throw new Error();
      const data = await res.json();
      
      // Si la consulta del json-server no devolvió ninguna función, creamos una para este movieId y la subimos
      if (data.length === 0) {
        throw new Error('No functions found, generating default');
      }
      return data;
    } catch {
      console.warn(`⚠️ cinemaApi: Conexión con json-server offline. Usando caché local para funciones.`);
      initializeLocalCache();
      return localFunctionsCache.filter((f) => f.movieId === movieId);
    }
  },

  // 3. Bloquear / Liberar Asientos
  async updateOccupiedSeats(functionId: string, seatIds: string[], action: 'lock' | 'release'): Promise<CinemaFunction> {
    try {
      // 1. Buscar estado actual
      const getRes = await fetch(`${API_BASE_URL}/functions/${functionId}`);
      if (!getRes.ok) throw new Error();
      const currentFn: CinemaFunction = await getRes.json();

      let newOccupied = [...currentFn.occupiedSeats];
      if (action === 'lock') {
        // Evitar duplicados
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
      
      return await patchRes.json();
    } catch {
      console.warn(`⚠️ cinemaApi: Error al conectar con el servidor. Realizando cambio en la caché local.`);
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
    const newReservation = {
      id: Math.random().toString(36).substring(2, 9),
      ...resData
    };

    try {
      const res = await fetch(`${API_BASE_URL}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReservation),
        signal: AbortSignal.timeout(1500)
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      console.warn('⚠️ cinemaApi: Conexión offline. Guardando tiquete en localStorage.');
      // Guardado local tradicional
      const saved = localStorage.getItem('cinema_tickets');
      const list = saved ? JSON.parse(saved) : [];
      localStorage.setItem('cinema_tickets', JSON.stringify([newReservation, ...list]));
      return newReservation;
    }
  }
};
