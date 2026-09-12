/// <reference types="vite/client" />

/**
 * Typed definition for Vite environment variables.
 */
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
