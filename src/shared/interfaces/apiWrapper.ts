/**
 * Generic wrapper used by the backend for endpoints returning { success, data }.
 */
export interface ApiWrapper<T> {
  success: boolean;
  data: T;
}
