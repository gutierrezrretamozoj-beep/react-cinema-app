export interface Country {
  id: number;
  name: string;
}

export interface Department {
  id: number;
  name: string;
  countryId: number;
}

export interface City {
  id: number;
  name: string;
  departamentId: number;
  isActive: boolean;
}