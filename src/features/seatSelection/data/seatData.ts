// seatData.ts — Generación de datos de asientos para la sala de cine
// Soporta multi-selección y asientos pseudo-aleatorios basados en movieId.

export interface SeatData {
  id: string;
  row: string;
  col: number;
  type: 'standard' | 'vip';
  price: number;
  position: [number, number, number]; // Posición en espacio 3D
  status: 'available' | 'selected' | 'occupied';
}

// ROWS: Filas de la sala. A–B son VIP (cerca de la pantalla), C–F son estándar.
const ROWS = ['A', 'B', 'C', 'D', 'E', 'F'];
const COLS = 8;

const VIP_PRICE = 14.5;
const STANDARD_PRICE = 9.5;

// Listas de asientos pre-ocupados por película (basadas en movieId para consistencia)
const OCCUPIED_BY_MOVIE: Record<string, string[]> = {
  "1": ['A-3', 'A-4', 'B-1', 'B-6', 'C-4', 'C-5', 'D-2', 'D-8', 'E-4', 'E-5', 'F-7'],
  "2": ['A-1', 'A-8', 'B-3', 'B-5', 'C-2', 'C-6', 'D-1', 'D-7', 'E-3', 'F-4', 'F-6'],
  "3": ['A-2', 'A-5', 'B-2', 'B-7', 'C-1', 'C-8', 'D-3', 'D-6', 'E-1', 'E-8', 'F-5'],
  "4": ['A-4', 'A-6', 'B-4', 'B-8', 'C-3', 'C-7', 'D-4', 'D-5', 'E-2', 'E-7', 'F-3'],
  "5": ['A-3', 'A-7', 'B-2', 'B-6', 'C-5', 'C-8', 'D-1', 'D-8', 'E-3', 'E-6', 'F-2'],
  "6": ['A-1', 'A-5', 'B-3', 'B-7', 'C-2', 'C-6', 'D-3', 'D-7', 'E-4', 'E-7', 'F-1'],
  "7": ['A-2', 'A-6', 'B-4', 'B-8', 'C-1', 'C-7', 'D-2', 'D-6', 'E-5', 'E-8', 'F-4'],
  "8": ['A-3', 'A-5', 'B-1', 'B-7', 'C-4', 'C-8', 'D-3', 'D-5', 'E-2', 'E-6', 'F-3'],
};

// generateSeats — Genera la grilla completa de asientos en 2D y 3D
export const generateSeats = (movieId: string): SeatData[] => {
  const occupied = OCCUPIED_BY_MOVIE[movieId] ?? OCCUPIED_BY_MOVIE["1"];
  const seats: SeatData[] = [];

  ROWS.forEach((row, rIndex) => {
    // A y B son VIP (filas de lujo, más cerca de la pantalla)
    const isVIP = row === 'A' || row === 'B';
    const price = isVIP ? VIP_PRICE : STANDARD_PRICE;

    for (let col = 1; col <= COLS; col++) {
      const id = `${row}-${col}`;

      // Coordenadas 3D del asiento
      const x = (col - 4.5) * 1.35;
      const y = rIndex * 0.38;
      const z = (rIndex - 2.5) * 2.2 + 2;

      seats.push({
        id,
        row,
        col,
        type: isVIP ? 'vip' : 'standard',
        price,
        position: [x, y, z],
        status: occupied.includes(id) ? 'occupied' : 'available',
      });
    }
  });

  return seats;
};

export const ROWS_ORDER = ROWS;
export const COLS_COUNT = COLS;
