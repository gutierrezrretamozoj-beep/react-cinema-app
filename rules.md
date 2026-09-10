# Directivas de Post-procesamiento y Adaptación de UI

Cuando consumas herramientas MCP de diseño (Stitch, UXMagic, AIDesigner):

1. **Alineación con DESIGN.md:**
   - Queda estrictamente prohibido usar valores arbitrarios de color en Tailwind (ej: `bg-[#121212]` o `bg-zinc-900`) si ya existe un token en `DESIGN.md`.
   - Reemplaza todo color por su token semántico definido en `@theme`:
     - Fondo principal -> `bg-cinema-bg`
     - Tarjetas/Superficies -> `bg-cinema-surface`
     - Textos -> `text-cinema-text` y `text-cinema-muted`
     - Botones principales/Acentos -> `bg-cinema-primary`
     - Filas/Asientos VIP -> `text-cinema-vip` o `bg-cinema-vip`

2. **Compatibilidad con Tailwind CSS v4:**
   - No generes ni hagas referencia a `tailwind.config.js`.
   - Si una clase exportada por el MCP usa utilidades deprecadas o clases en línea (`style={{ ... }}`), tradúcelas a utilidades nativas de Tailwind v4.

3. **Arquitectura React 19 + TypeScript:**
   - La salida nunca debe ser HTML plano. Debe ser JSX/TSX tipado con interfaces explícitas.
   - Mantén componentes modulares y limpios, respetando la estructura de carpetas de `src/features/`.
   - Nunca modifiques o reemplaces la lógica de Three.js / Canvas 3D ni el estado del stepper multipasos si solo se solicitó un rediseño de presentación visual.    