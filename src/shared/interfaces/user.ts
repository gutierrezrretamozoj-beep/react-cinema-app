/**
 * Payload required to create a new user via POST /users.
 */
export interface CreateUserPayload {
  email: string;
  password: string;
  document_type_id: number;
  document_number: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  gender: string;
  phone: string;
  address: string;
  city_id: number;
}
