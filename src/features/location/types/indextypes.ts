// Opcion generica para los selects del asistente de ubicacion.
export interface LocationOption {
  id: string | number;
  name: string;
  active?: boolean;
}

// Valores seleccionados actualmente en el asistente.
export interface LocationSelection {
  country: string | number;
  department: string | number;
  city: string | number;
}
