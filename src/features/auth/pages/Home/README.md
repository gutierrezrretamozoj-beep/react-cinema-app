# Cartelera de Cine - Página de Inicio (Home)

Este módulo contiene la lógica y los componentes de la cartelera interactiva de cine.

## Estructura de Archivos

```text
Home/
├── HomePage.tsx               # Componente y controlador principal de la cartelera
├── README.md                  # Documentación del módulo
└── components/
    ├── Badge.tsx              # Insignias modulares reutilizables
    ├── FeaturedCarousel.tsx   # Carrusel panorámico de películas destacadas
    └── MovieCard.tsx          # Tarjeta de película con forma de boleto y rasgado 3D
```

> Los datos ya no viven en `data/movieData.ts`. Ahora el feature de cartelera
> (`src/features/movies`) expone el catálogo, la capa de API, la gestión de
> ciudad y el motor de filtros que consume esta página.

---

## Funcionalidades y Componentes

### 1. `HomePage.tsx`
* **Filtros Reactivos**: Gestiona la cartelera ("En Cartelera" / "Próximamente"), categorías por género y filtros rápidos por hora.
* **Persistencia en URL**: Cada filtro se sincroniza como query parameter (`status`, `genre`, `timeSlot`), de modo que el estado se conserva al recargar o compartir la URL.
* **Actualización en tiempo real**: Cambiar cualquier filtro re-renderiza los resultados sin recargar la página.
* **Limpiar filtros**: El botón "Limpiar todos los filtros" resetea el estado y los parámetros de la URL en una sola acción.
* **Enfoque Inteligente**: Al hacer clic en comprar desde el carrusel de destacados, la página cambia automáticamente de pestaña/género para asegurar la visibilidad del boleto, se desplaza suavemente hasta él y añade un anillo dorado temporal de enfoque (`ring-2 ring-yellow-500 scale-105`) por 2 segundos.
* **Notificaciones**: Despliega alertas Toast flotantes con temporizador de auto-cierre de 4 segundos.

### 2. `FeaturedCarousel.tsx`
* **Transiciones Cinemáticas**: Animación de fundido cruzado y escala al alternar imágenes panorámicas de fondo (*backdrops*).
* **Autoplay Inteligente**: Avanza cada 5 segundos de forma automática. La reproducción se pausa al colocar el cursor sobre el carrusel y se reanuda al salir.
* **Navegación Manual**: Botones flotantes laterales y dots de salto rápido.

### 3. `MovieCard.tsx`
* **Diseño de Boleto Real**: Estructura dividida (Cuerpo, Divisor y Talón) que evita líneas de borde pasando por las muescas.
* **Muescas Estilo Login**: Máscaras circulares en los laterales de color sólido `bg-neutral-950` sin bordes propios, integrándose limpiamente con el fondo.
* **Horarios con estado**: Los horarios agotados (`isSoldOut`) se muestran tachados y deshabilitados; los inactivos (`isActive: false`) quedan excluidos del dataset.
* **Desgarre 3D**: Al seleccionar un horario y confirmar la compra, el talón rota sobre los tres ejes de perspectiva 3D y cae por gravedad. Al finalizar la animación, se revela el ticket con código de barras digital.

### 4. `Badge.tsx`
* Componente modular y consistente con bordes **`rounded-lg`** para consistencia con el diseño de las cards y películas destacadas.
* **Variantes**: Géneros, clasificaciones por edad (verde para A/B, amarillo para B15, rojo para C), etiqueta "Destacada" y etiqueta "Precompra".

---

## Feature de cartelera (`src/features/movies`)

Contiene la lógica de datos y negocio de la cartelera:

* `interfaces/` — tipos `Movie`, `Showtime`, `MovieFilters` y respuestas de la API.
* `data/movies.json` — contrato mock que consume la capa de API y puede ser compartido con otros desarrolladores.
* `api/moviesApi.ts` — cliente HTTP con los endpoints `GET /movies`, `GET /movies/weekly`, `GET /movies/today` y `GET /movies/filter`, con fallback al mock cuando no hay backend.
* `api/locationService.ts` — detección, guardado (LocalStorage) e inyección de la ciudad del visitante en cada petición.
* `helpers/` — motor de filtros y reglas de negocio para showtimes (inactivos y agotados).
* `hooks/useMovieListings.ts` — hook principal que sincroniza los filtros con la URL y calcula los resultados en tiempo real.

---

## Sistema de Precompra (Preventas)
Para evitar que el usuario asuma que verá la película inmediatamente tras la compra de un próximo estreno (`status === 'coming-soon'`):
1. Se muestra una insignia violeta pulsante con el texto **"Precompra"** junto al género.
2. La etiqueta de los botones de llamada a la acción cambia dinámicamente de "Comprar" a **"Precomprar Ticket / Boleto"**.
3. El mensaje Toast final de confirmación indica que se trata de una preventa para el estreno oficial.