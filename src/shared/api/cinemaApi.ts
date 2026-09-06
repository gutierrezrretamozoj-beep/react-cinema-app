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
  date: string;
  time: string;
  seats: string[];
  format: string;
  code: string;
  total: number;
}

// Bandera y almacenamiento interno para simular base de datos local en fallback
let localFunctionsCache: CinemaFunction[] = [];

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
