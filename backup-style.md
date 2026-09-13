# 🎬 Backup Style: Warm Cream Paper (Criterion / A24 Editorial)

Este archivo almacena el respaldo completo de tokens, variables y configuración visual de la paleta clara **"Warm Cream Paper"**, inspirada en la estética editorial de Criterion Channel y A24.

---

## 1. Muestra y Especificación de Colores

| Token Semántico | Valor Hex / RGBA | Función |
| :--- | :--- | :--- |
| **`--color-cinema-bg`** | `#f6f5ef` | Fondo general de la página (papel crema suave, no deslumbra) |
| **`--color-cinema-surface`** | `#ffffff` | Tarjetas principales de cartelera, modal y contenedores |
| **`--color-cinema-surface-elevated`** | `#eae8df` | Hover de tarjetas, chips elevados y botones secundarios |
| **`--color-cinema-surface-card`** | `#ffffff` | Tarjetas anidadas y cajas de fecha/horario |
| **`--color-cinema-border`** | `rgba(0, 0, 0, 0.08)` | Bordes sutiles sin saturación de neón |
| **`--color-cinema-border-active`** | `rgba(24, 62, 188, 0.4)` | Borde de tarjetas activas o con foco |
| **`--color-cinema-text`** | `#1c1917` | Texto principal de alto contraste (Stone 900) |
| **`--color-cinema-muted`** | `#57534e` | Sinopsis, duración y textos descriptivos (Stone 600) |
| **`--color-cinema-dim`** | `#8c857e` | Subtítulos terciarios, horas pasadas y pies de foto |
| **`--color-cinema-primary`** | `#183ebc` | Azul real de marca para botones principales de compra |
| **`--color-cinema-primary-hover`** | `#143299` | Estado hover de botones primarios |
| **`--color-cinema-electric`** | `#00a8cc` | Cian contrastado adaptado para legibilidad en fondo claro |
| **`--color-cinema-gold`** / **`vip`** | `#d97706` | Acento ámbar/dorado para rating y salas VIP |
| **`--color-cinema-orange`** | `#ea580c` | Acento de preventa y llamadas a la acción |

---

## 2. Configuración en `src/index.css` (Tailwind CSS v4)

Para volver a aplicar esta paleta en el futuro, basta con sustituir el bloque `@theme` en `src/index.css`:

```css
@theme {
  /* Tokens Tipográficos */
  --font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  --font-monument: 'Monument Extended', sans-serif;

  /* PALETA WARM CREAM PAPER - Tokens Semánticos */
  --color-cinema-bg: #f6f5ef;
  --color-cinema-surface: #ffffff;
  --color-cinema-surface-elevated: #eae8df;
  --color-cinema-surface-card: #ffffff;
  --color-cinema-border: rgba(0, 0, 0, 0.08);
  --color-cinema-border-active: rgba(24, 62, 188, 0.4);

  /* Colores Principales */
  --color-cinema-primary: #183ebc;
  --color-cinema-primary-hover: #143299;
  --color-cinema-electric: #00a8cc;
  --color-cinema-cyan: #00a8cc;
  --color-cinema-azure: #0a66c2;
  --color-cinema-midnight: #f6f5ef;
  --color-cinema-slate: #eae8df;

  /* Colores de Acento */
  --color-cinema-turquoise: #00a8cc;
  --color-cinema-orange: #ea580c;
  --color-cinema-gold: #d97706;
  --color-cinema-vip: #d97706;
  --color-cinema-magenta: #9333ea;

  /* Textos */
  --color-cinema-text: #1c1917;
  --color-cinema-muted: #57534e;
  --color-cinema-dim: #8c857e;
}

:root {
  color-scheme: light;
}

::selection {
  background-color: rgba(24, 62, 188, 0.2);
  color: #1c1917;
}

.screen-bar-glow {
  background: linear-gradient(90deg, transparent, #183ebc, #00a8cc, #183ebc, transparent);
  box-shadow: 0 2px 14px rgba(24, 62, 188, 0.25);
}
```

---

## 3. Características clave del estilo

1. **Anti-fatiga visual**: La temperatura cálida (`#f6f5ef`) evita el blanco deslumbrante (#ffffff) de monitores de alta gama.
2. **Fotogénico para pósters**: Las carátulas de películas y fotos de cines resaltan con bordes limpios y sombras naturales.
3. **Elegancia editorial**: Ideal para festivales de cine, cines de autor, reseñas y venta de entradas con acabado de revista de arte.
