/**
 * Department entity returned by GET /departments?countryId=.
 */
export interface Department {
  id: number;
  countryId: number;
  name: string;
}
