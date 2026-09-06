// seatData.ts — Generación paramétrica de datos de asientos para salas de cine
// Soporta salas Estándar (6x8 = 48) e IMAX de alto rendimiento (8x10 = 80 asientos).

export interface SeatData {
  id: string;
  row: string;
  col: number;
  type: 'standard' | 'vip' | 'accessible';
  price: number;
  position: [number, number, number]; // Posición en espacio 3D
  status: 'available' | 'selected' | 'occupied';
}

export interface RoomConfig {
  rows?: string[];
  cols?: number;
  roomType?: 'standard' | 'imax' | '4dx' | 'kids';
  occupiedSeats?: string[];
  movieId?: string;
}

export const DEFAULT_ROWS = ['A', 'B', 'C', 'D', 'E', 'F'];
export const DEFAULT_COLS = 8;

export const IMAX_ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
export const IMAX_COLS = 10;

const VIP_PRICE = 14.5;
const STANDARD_PRICE = 9.5;
const ACCESSIBLE_PRICE = 8.5;

// generateSeats — Genera la grilla de asientos 2D y 3D según la sala
export const generateSeats = (config?: RoomConfig | string): SeatData[] => {
  let rows = DEFAULT_ROWS;
  let cols = DEFAULT_COLS;
  let occupied: string[] = [];
  let isImax = false;

  if (typeof config === 'string') {
    // Modo retrocompatible si sólo pasan movieId
    rows = DEFAULT_ROWS;
    cols = DEFAULT_COLS;
  } else if (config) {
    if (config.rows && config.rows.length > 0) rows = config.rows;
    if (config.cols) cols = config.cols;
    if (config.roomType === 'imax') isImax = true;
    if (config.occupiedSeats) occupied = config.occupiedSeats;
  }

  const seats: SeatData[] = [];
  const midCol = (cols + 1) / 2;
  const midRow = (rows.length - 1) / 2;
  const aisleThreshold = cols / 2; // Columna donde se divide el pasillo central

  // En IMAX las filas B y C son VIP
  const vipRows = isImax ? ['B', 'C'] : ['A', 'B'];

  rows.forEach((row, rIndex) => {
    const isVIP = vipRows.includes(row);

    for (let col = 1; col <= cols; col++) {
      const id = `${row}-${col}`;

      // Asientos accesibles: ubicados en la fila A (extremos de fácil acceso por rampa)
      const isAccessible = row === 'A' && (col === 1 || col === cols);

      let type: 'standard' | 'vip' | 'accessible' = 'standard';
      let price = STANDARD_PRICE;

      if (isAccessible) {
        type = 'accessible';
        price = ACCESSIBLE_PRICE;
      } else if (isVIP) {
        type = 'vip';
        price = VIP_PRICE;
      }

      // Pasillo central en 3D: desplazamos el bloque izquierdo hacia la izquierda y el derecho a la derecha
      const aisleOffset = col <= aisleThreshold ? -0.45 : 0.45;
      const x = (col - midCol) * 1.35 + aisleOffset;
      const y = rIndex * 0.38;

      // Z: calibración de campo visual óptima (3.2 en IMAX para vista envolvente y cercana)
      const baseDistanceZ = isImax ? 3.2 : 2.0;
      const z = (rIndex - midRow) * 2.2 + baseDistanceZ;

      seats.push({
        id,
        row,
        col,
        type,
        price,
        position: [x, y, z],
        status: occupied.includes(id) ? 'occupied' : 'available',
      });
    }
  });

  return seats;
};

// Detección de asientos huérfanos (Single Orphan Seat Gap Rule)
// Retorna si una configuración hipotética de asientos seleccionados dejaría un asiento solo aislado
export const checkOrphanSeats = (
  tentativeSelectedIds: string[],
  allSeats: SeatData[],
  rows: string[],
  cols: number
): { hasOrphan: boolean; orphanSeatId?: string } => {
  for (const row of rows) {
    const rowSeats = allSeats.filter((s) => s.row === row).sort((a, b) => a.col - b.col);
    const aisleMid = Math.floor(cols / 2);

    // Dividimos en dos bloques (izquierdo y derecho) si hay pasillo central
    const blocks = [
      rowSeats.filter((s) => s.col <= aisleMid),
      rowSeats.filter((s) => s.col > aisleMid),
    ];

    for (const block of blocks) {
      // Mapeamos el estado de cada asiento: 1 si ocupado o seleccionado, 0 si libre
      const states = block.map((s) => ({
        id: s.id,
        taken: s.status === 'occupied' || tentativeSelectedIds.includes(s.id),
      }));

      for (let i = 0; i < states.length; i++) {
        if (!states[i].taken) {
          // El asiento está libre. ¿Está aislado por los dos lados?
          const leftBoundary = i === 0 || states[i - 1].taken;
          const rightBoundary = i === states.length - 1 || states[i + 1].taken;

          if (leftBoundary && rightBoundary) {
            return {
              hasOrphan: true,
              orphanSeatId: states[i].id,
            };
          }
        }
      }
    }
  }

  return { hasOrphan: false };
};

export const ROWS_ORDER = DEFAULT_ROWS;
export const COLS_COUNT = DEFAULT_COLS;
