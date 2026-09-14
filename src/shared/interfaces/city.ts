/**
 * City entity returned by GET /cities?departmentId=.
 */
export interface City {
  id: number;
  departmentId: number;
  name: string;
  isActive: boolean;
}
