# Documento de Diseño de Software & Sistema de Diseño (design.md)

## Proyecto: DEXUS Cinema App (Multiplex Inmersivo & Rich UI)
- **Estándar de Interfaz**: **Rich UI Cinematográfica & Dark Mode Premium (Experiencia Dexus Cinema)**
- **Tecnologías UI**: React 19, Tailwind CSS v4, Framer Motion 13, Three.js / React Three Fiber, Lucide Icons
- **Estado de Referencia**: Vista **"Home / Inicio"** actual como estándar visual y arquitectónico mandatario para toda la aplicación.

---

## 1. Filosofía de Diseño: Dexus Corporate Midnight

La experiencia visual de la aplicación se rige bajo la identidad **Dexus Cinema (Corporate Midnight)**. Toda vista desarrollada en la aplicación debe sentirse parte de una misma experiencia cinematográfica inmersiva, cohesiva y de alta gama.

### Principios Fundamentales:
1. **Lienzo Ambiental Continuo:**
   - No se usan fondos planos ni grises genéricos. Se utiliza un lienzo oscuro (`#070d18`) con un fondo ambiental multi-radial fijo que baña suavemente la interfaz con halos azul eléctrico y turquesa.
   - Las páginas hijas deben tener fondo transparente (`bg-transparent`) para permitir que la atmósfera ambiental fluya entre rutas sin saltos visuales.
2. **Efecto Cristal y Profundidad (Glassmorphism):**
   - Tarjetas, barras y modales usan fondos translúcidos oscuros con desenfoque de fondo (`backdrop-blur-md`, `backdrop-blur-xl`), bordes sutiles y limpios (`border-white/10`) y sombras profundas con destellos dirigidos.
3. **Alto Impacto Visual sin Sobrecarga:**
   - Jerarquía clara entre elementos protagónicos (pósters a sangre, trailers en video, carruseles cinematográficos) y controles de soporte (botones redondeados, tipografía monospaciada técnica).
4. **Interactividad Viva y Fluida:**
   - Micro-animaciones con curvas de transición elásticas (`cubic-bezier(0.22, 1, 0.36, 1)`), transiciones de rutas sutiles en eje vertical/opacidad y retroalimentación inmediata en cada acción.

---

## 2. Sistema Tipográfico Oficial

La aplicación cuenta con una estricta jerarquía tipográfica compuesta por **tres familias tipográficas**, cada una con propósitos y reglas de uso delimitadas.

| Tipografía | Clase / Token Tailwind | Propósito Exclusivo | Dónde usar (Obligatorio) | Dónde NUNCA usar |
|---|---|---|---|---|
| **Monument Extended** | `font-monument` | **Identidad de Marca & Titulares de Alto Impacto Cinematográfico** | • Logotipo / Branding oficial ("DEXUS FILMS")<br>• Título principal del Hero Carousel (`font-black`)<br>• Títulos de secciones principales en Home/Vistas ("EN CARTELERA", "PRÓXIMAMENTE", "NUESTROS CINES")<br>• Enlaces del menú Navbar (`font-normal text-[0.7rem] tracking-[0.16em]`)<br>• Textos de botones de acción principal (CTA: "COMPRAR BOLETOS", "VER CARTELERA", "MIS BOLETOS")<br>• Nombres de complejos de cine y títulos de modales principales | • **PROHIBIDO** en textos largos, párrafos descriptivos, sinopsis o fichas técnicas.<br>• Su ancho expandido satura la pantalla si se usa en cuerpos de texto. |
| **Plus Jakarta Sans** (o System Sans) | `font-sans` (por defecto) | **Cuerpo, Lectura Continua & UI General** | • Subtítulos explicativos de sección (ej. "Películas disponibles hoy...")<br>• Sinopsis de películas, biografías y fichas informativas<br>• Títulos secundarios de tarjetas y componentes<br>• Mensajes de formulario, modales informativos, inputs y tooltips<br>• Textos de botones secundarios y enlaces de navegación auxiliar | • Títulos de gran impacto o branding de pantalla completa. |
| **Monospaced (Tipografía Técnica)** | `font-mono` | **Metadatos Técnicos, Horarios & Precios Tabulares** | • Duración de películas (`148 min`, `122 min`)<br>• Años y fechas (`2024`, `15:30`)<br>• Etiquetas de género en mayúsculas (`text-[10px] uppercase tracking-widest`)<br>• Precios y cálculos de compra (`$9.50`, `$14.50`)<br>• Códigos de butaca (`F-8`), códigos de confirmación y QR de entradas<br>• Temporizadores regresivos de reserva | • Títulos, botones de navegación o textos literarios. |

---

## 3. Paleta Cromática y Tokens Semánticos (Tailwind CSS v4)

Los tokens están declarados formalmente en `src/index.css` dentro de `@theme` y representan la paleta oficial que efectivamente se utiliza en la interfaz:

```css
@theme {
  /* 1. Lienzo, Superficies y Bordes */
  --color-cinema-bg: #101929;
  --color-cinema-midnight: #101929;
  --color-cinema-surface: #1a263c;
  --color-cinema-surface-card: #141f33;
  --color-cinema-border: rgba(154, 179, 207, 0.16);

  /* 2. Colores Principales de Marca y Acento */
  --color-cinema-primary: #183ebc;
  --color-cinema-primary-hover: #2350ea;
  --color-cinema-electric: #00d2ff;
  --color-cinema-turquoise: #00d2ff;

  /* 3. Acentos de Detalle */
  --color-cinema-gold: #ffb800;
  --color-cinema-orange: #ff5500;

  /* 4. Textos y Jerarquía */
  --color-cinema-text: #f9f9fb;
  --color-cinema-muted: #9ab3cf;
  --color-cinema-dim: #647d9e;

  /* 5. Clasificaciones por Edad (Badges) */
  --color-badge-familiar: #10b981;
  --color-badge-15: #f59e0b;
  --color-badge-18: #f97316;
  --color-badge-naptp: #f43f5e;

  /* 6. Estados de Sala y Feedback */
  --color-seat-accessible: #06b6d4;
  --color-status-success: #10b981;
  --color-status-danger: #ef4444;
}
```

### 3.1 Guía de Aplicación de Color en Componentes

| Rol | Token Semántico | Valor / Clase | Aplicación en la Vista Home & Resto de Vistas |
|---|---|---|---|
| **Lienzo Base** | N/A (Fondo Global) | `#070d18` + Gradientes Radiales | Fondo único aplicado al `body` en `index.css`. Todas las vistas deben montarse sobre `bg-transparent`. |
| **Fondo Oscuro** | `--color-cinema-bg` / `midnight` | `#101929` (`bg-cinema-bg`, `from-cinema-midnight`) | Fondo de contenedores oscuros y gradientes inferiores en tarjetas de cines. |
| **Superficie Translúcida** | `--color-cinema-surface` | `#1a263c` (`bg-cinema-surface/75`) | Fondo de tarjetas de películas (`MovieRowCard`), cápsulas y tarjetas de complejos. |
| **Superficie Profunda** | `--color-cinema-surface-card` | `#141f33` (`bg-cinema-surface-card`) | Chips de tecnología y servicios en tarjetas de complejos (`IMAX`, `VIP`, `DOLBY`). |
| **Azul Primario (Royal Blue)** | `--color-cinema-primary` | `#183ebc` (`bg-cinema-primary`) | Botones principales de acción (CTA: "COMPRAR BOLETOS", "VER MÁS"). Hover: `#2350ea` (`hover:bg-cinema-primary-hover`). |
| **Turquesa / Cian Eléctrico** | `--color-cinema-turquoise` / `electric` | `#00d2ff` (`text-cinema-turquoise`, `bg-cinema-turquoise`) | Acento insignia Dexus: indicador activo en Navbar, puntos de pulso de sección, halos hover y bordes de impacto. |
| **Dorado / Acento Épico** | `--color-cinema-gold` | `#ffb800` (`text-cinema-gold`) | Estrellas de calificación en Hero Carousel y métricas destacadas. |
| **Naranja Cálido** | `--color-cinema-orange` | `#ff5500` (`text-cinema-orange`) | Icono de ubicación geográfica en las tarjetas de cines. |
| **Borde Sutil** | `--color-cinema-border` | `rgba(154, 179, 207, 0.16)` (`border-cinema-border`) | Separadores de sección, borde superior del Footer y líneas divisorias. |
| **Texto Principal** | `--color-cinema-text` | `#f9f9fb` (`text-cinema-text`) | Títulos, titulares y datos destacados de máxima legibilidad. |
| **Texto Secundario** | `--color-cinema-muted` | `#9ab3cf` (`text-cinema-muted`) | Subtítulos explicativos de sección, textos del Footer y metadatos de apoyo. |
| **Texto Atenuado** | `--color-cinema-dim` | `#647d9e` (`text-cinema-dim`) | Etiquetas en mayúsculas de micro-metadatos ("SERVICIOS", "RESTANTES"). |
| **Badge Familiar** | `--color-badge-familiar` | `#10b981` (`text-badge-familiar`) | Clasificación para todo público (`A`, `TP`, `familiar`). |
| **Badge +15** | `--color-badge-15` | `#f59e0b` (`text-badge-15`) | Clasificación para mayores de 15 años (`+15`, `B15`). |
| **Badge +18** | `--color-badge-18` | `#f97316` (`text-badge-18`) | Clasificación adultos (`+18`, `C`). |
| **Badge NAPTP** | `--color-badge-naptp` | `#f43f5e` (`text-badge-naptp`) | Clasificación No Apta Para Todo Público. |
| **Accesibilidad / Silla de ruedas** | `--color-seat-accessible` | `#06b6d4` (`bg-seat-accessible`) | Butacas y señalización de movilidad reducida (PMR). |
| **Éxito / Aprobado** | `--color-status-success` | `#10b981` (`text-status-success`) | Pago exitoso, entrada confirmada y reserva válida. |
| **Peligro / Error** | `--color-status-danger` | `#ef4444` (`text-status-danger`) | Error en formulario, tiempo agotado y butaca ocupada. |

---

## 4. Estándar Global de Clasificaciones por Edad (Badges)

Para mantener total coherencia con el diseño de Home, las clasificaciones de películas **deben** utilizar la función compartida `getRatingBadgeProps(rating)` disponible en `@/features/movies/data/movieData`:

| Clasificación | Código | Token Semántico | Valor Hex | Clases Oficiales Tailwind |
|---|---|---|---|---|
| **Para Todo Público** | `familiar` / `A` / `TP` | `--color-badge-familiar` | `#10b981` | `bg-badge-familiar/15 text-badge-familiar border border-badge-familiar/30` |
| **Mayores de 15 años** | `+15` / `B15` | `--color-badge-15` | `#f59e0b` | `bg-badge-15/15 text-badge-15 border border-badge-15/30` |
| **Mayores de 18 años** | `+18` / `C` | `--color-badge-18` | `#f97316` | `bg-badge-18/15 text-badge-18 border border-badge-18/30` |
| **No Apta para Todo Público** | `NAPTP` | `--color-badge-naptp` | `#f43f5e` | `bg-badge-naptp/15 text-badge-naptp border border-badge-naptp/30` |

---

## 5. Patrones de Componentes de la Vista "Home" a Replicar

Cualquier nueva vista o modificación de vistas existentes debe seguir fielmente los siguientes patrones probados en la vista Home:

### 5.1 Barra de Navegación (Navbar Dexus)
- **Posición y Fondo:** Fijo superior (`fixed top-0 inset-x-0 z-50`). En Home al tope es transparente (`bg-transparent py-4`); al hacer scroll o en vistas secundarias se convierte en `bg-neutral-950/85 backdrop-blur-md border-b border-neutral-800/80 shadow-2xl py-3`.
- **Navegación Desktop:** Enlaces en `font-monument text-[0.7rem] font-normal tracking-[0.16em]` con barra indicadora inferior en turquesa (`#00d2ff`) para la ruta activa.
- **Botón Mis Boletos:** Cápsula circular/pill glassmorphism con icono `Ticket` rotando sutilmente al hover.
- **Perfil / Sesión:**
  - Si no está autenticado: Botón circular con icono `User` redirigiendo a `/auth/login`.
  - Si está autenticado: Saludo con nombre de usuario y botón de cerrar sesión (`LogOut`).
- **Móvil:** Botón hamburguesa interactivo (`Menu` / `X`) que despliega un drawer animado con Framer Motion conteniendo todas las opciones con iconos dedicados:
  - 🏠 Inicio (`Home`)
  - 🎬 Cartelera (`Film`)
  - 📅 Próximamente (`CalendarClock` — estándar oficial de fecha/estreno)
  - 🎟️ Mis Boletos (`Ticket`)
  - 👤 Perfil / Iniciar Sesión (`User`) o Cerrar Sesión (`LogOut`)

### 5.2 Tarjetas de Películas a Sangre (MovieRowCard)
- **Formato:** Proporción póster vertical `aspect-2/3`, esquinas redondeadas `rounded-2xl`, borde `border-white/10`, elevación `hover:-translate-y-1.5`.
- **Efecto Hover Cinemático:**
  - Zoom suave de imagen: `group-hover:scale-105 transition-transform duration-500`.
  - Máscara oscura con desenfoque: `absolute inset-0 bg-black/75 backdrop-blur-[2px] opacity-0 group-hover:opacity-100`.
  - Disposición interna en tres zonas:
    1. **Arriba:** Título en blanco (`text-sm font-bold`).
    2. **Centro:** Duración en `font-mono`, separador `|`, badge de clasificación por color y género en mayúsculas `font-mono`.
    3. **Abajo:** Botón interactivo con flecha y línea expansiva animada que se despliega al pasar el ratón.

### 5.3 Filas Horizontales con Flechas Cinemáticas (MovieScrollRow)
- Encabezado con punto de pulso neón (`h-2 w-2 rounded-full bg-cinema-turquoise animate-pulse`) + título en `font-monument text-lg sm:text-xl uppercase` + subtítulo en `text-xs text-cinema-muted`.
- Flechas laterales de navegación izquierda/derecha integradas sobre los bordes con gradiente a negro (`from-transparent to-black/60`), visibles en desktop y desactivadas con opacidad suave cuando no hay más desplazamiento.
- Tarjeta de remate "Ver más" (`SeeMoreCard`) al final de la fila con enlace a la vista completa del catálogo.

### 5.4 Tarjetas de Complejos de Cine (CinemaTheatersSection)
- Tarjetas con imagen panorámica del cine, badge de formato premium (IMAX / MacroXE / VIP), dirección y servicios disponibles representados con iconos y etiquetas sutiles.

---

## 6. Guía de Adaptación para las Demás Vistas de la Aplicación

Para que el proyecto mantenga consistencia visual absoluta, las demás vistas deben alinearse bajo este estándar:

### 6.1 Cartelera General (`/movies`) y Próximamente (`/coming-movies`)
- **Encabezado:** Título de página en `font-monument text-2xl sm:text-3xl` con badge de total de películas disponibles.
- **Filtros de Género y Fecha:** Botones tipo cápsula (`rounded-full`) con borde `border-white/10` y fondo translúcido. El estado activo utiliza `bg-cinema-primary text-white border-cinema-primary shadow-[0_0_15px_rgba(24,62,188,0.4)]`.
- **Grilla de Películas:** Grid responsiva con tarjetas que respeten el mismo formato visual, hover cinematográfico y badges de clasificación que las de Home.
- **Previsualización de Tráiler:** Las tarjetas que reproduzcan tráilers deben utilizar autoplay silenciado (`autoplay=1&mute=1&controls=0&playsinline=1`) con contenedor `pointer-events-none` para evitar que el puntero interrumpa el hover.

### 6.2 Detalle de Película (`/movies/:movieId`)
- **Hero de Película:** Backdrop panorámico a pantalla completa con gradiente inferior continuo fundiéndose al fondo ambiental (`from-transparent via-[#070d18]/80 to-[#070d18]`).
- **Título de la Película:** `font-monument text-3xl sm:text-4xl md:text-5xl font-black text-white`.
- **Metadatos:** Fila con duración en `font-mono`, badge de clasificación oficial, año y géneros en píldoras.
- **Horarios y Salas:** Botones de horarios agrupados por complejo cinematográfico con borde sutil y estado hover con resplandor turquesa.

### 6.3 Selección de Asientos y Compra (`/movies/:movieId/seats`)
- **Pantalla Cinemática:** Utilizar la clase oficial `.screen-bar-glow` con iluminación azul/cian (`#183ebc` y `#00d2ff`).
- **Butacas 2D:** Utilizar la clase `.seat-physical` con volumen tridimensional. Asientos seleccionados en turquesa `#00d2ff`, VIP en dorado `#ffb800`, estándar en azul pizarra y ocupados en gris atenuado.
- **Sala 3D (WebGL):** El visor 3D debe proyectar el tráiler real en la pantalla curvada y sincronizar la iluminación volumétrica con la paleta de la película.
- **Panel Lateral de Resumen:** Tarjeta flotante glassmorphism con totales y desglose en `font-mono`.

### 6.4 Confitería / Dulcería (`/concessions`)
- Cards de productos con fotos limpias sobre tarjetas translúcidas, badges de categoría (Combos, Palomitas, Bebidas, Dulces), botones de incremento/decremento intuitivos y precios tabulares en `font-mono`.

### 6.5 Carrito (`/cart`) y Mis Boletos (`/tickets`)
- Entradas con diseño tipo boleto perforado, código QR interactivo de alta nitidez, datos del showtime en `font-mono` y estado de confirmación con badges semánticos.

### 6.6 Autenticación: Login y Registro (`/auth/login`, `/auth/register`)
- Tarjeta central flotante con glassmorphism profundo (`bg-neutral-950/80 backdrop-blur-2xl border border-white/10 shadow-2xl`).
- Título en `font-monument text-xl sm:text-2xl font-bold text-center`.
- Campos de texto oscuros con borde sutil y foco en turquesa (`focus:border-cinema-turquoise focus:ring-1 focus:ring-cinema-turquoise`).
- Botón principal de submit en azul primario con hover dinámico.

---

## 7. Checklist de Calidad para Nuevos Componentes (Do's and Don'ts)

### ✅ Lo que SIEMPRE se debe hacer:
- Usar `font-monument` en títulos de sección, branding y botones principales (CTA).
- Usar `font-sans` para todo texto descriptivo, sinopsis, formularios y subtítulos.
- Usar `font-mono` para horarios, duraciones, precios y códigos técnicos.
- Mantener los fondos principales de páginas en `bg-transparent` para lucir el gradiente ambiental nocturno del `body`.
- Usar `getRatingBadgeProps()` para todas las etiquetas de clasificación de edades.
- Usar `border-white/10` como borde por defecto y `hover:border-cinema-turquoise/40` o `hover:border-white/25` para interactividad.
- Emplear el icono `CalendarClock` para todo lo referente a "Próximamente" o estrenos futuros.

### ❌ Lo que NUNCA se debe hacer:
- **NO** usar `font-monument` en párrafos, sinopsis o textos informativos largos.
- **NO** usar colores genéricos aislados (como amarillos o azules planos sin tokens) si no corresponden a la paleta oficial Dexus Cinema.
- **NO** colocar fondos opacos rígidos (como `bg-black` plano o `bg-zinc-900`) que rompan el gradiente ambiental continuo del cine.
- **NO** inventar colores o estilos diferentes para las clasificaciones de edad (+15, +18, familiar).
- **NO** olvidar el soporte responsivo: en pantallas móviles los carruseles deben permitir desplazamiento táctil suave (`scroll-smooth`, `overflow-x-auto`).
