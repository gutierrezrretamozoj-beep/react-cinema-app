# Reporte de Estado de Jira y Nivel de Cumplimiento

Este documento detalla el estado actual de las tareas asignadas en Jira a **Sebastián Mendoza Brieva**, el nivel de cumplimiento identificado tras revisar el código actual en el repositorio `react-cinema-app` y las mejoras implementadas.

---

## 1. Información del Usuario en Jira

- **Nombre**: Sebastián Mendoza Brieva
- **Correo**: sebas.mb12@gmail.com
- **Zona Horaria**: America/Bogota (GMT-5)
- **Estado de Cuenta**: Activo ✅

---

## 2. Estado de Tareas Asignadas (Resumen de Jira)

Tras la última iteración, el estado de tus tareas asignadas en el proyecto Cinema queda de la siguiente manera:

| Clave | Tarea | Estado en Código | Cumplimiento |
| :--- | :--- | :--- | :---: |
| **SCRUM-32** | 3D theater room view using React Three Fiber (R3F) | Sala 3D funcional con precarga en Suspense y condicionales de dispositivo | **100%** |
| **SCRUM-45** | HU-FE-010 — Interactive seat selection | Flujo 2D/3D con timer global de 10 min, blocker de ruta Swal-like y API | **100%** |
| **SCRUM-44** | HU-FE-009 — Showtime and format selection | Selectores UI de fecha/cine/formato e inhabilitación de horarios transcurridos | **100%** |
| **SCRUM-14** | HU-FE-001 — Frontend platform setup | Setup modular, AuthContext, HttpClient con fallback y json-server | **70%** |

---

## 3. Análisis de Brecha (Gap Analysis): Código vs. Jira

A continuación se detalla qué requerimientos específicos de cada historia de usuario (HU) están hechos en tu espacio de trabajo y qué queda pendiente:

### 🔍 SCRUM-32: 3D theater room view using React Three Fiber (R3F)
*Ver en 3D la sala de cine con R3F para seleccionar butacas antes de comprar.*

- **Hecho en tu código**:
  - Configuración e instalación de dependencias de Three.js y React Three Fiber.
  - Renderizado de sala 3D completa: pantalla, gradas (risers), paneles acústicos, LEDs de pasillos y luces.
  - Butacas en 3D mapeadas según coordenadas y coloreadas por tipo (VIP en amarillo, estándar en rojo, ocupado en gris, seleccionado en verde).
  - Dos modos de cámara: Orbital libre y Primera persona (butaca) con arrastre de mouse para mirar.
  - Tráiler de video reproduciéndose en la pantalla mediante textura de video con glow dinámico (trailer dinámico provisto por la base de datos).
  - Sincronización de estado bidireccional (seleccionar en 3D actualiza el mapa 2D y el total).
  - **Indicador de Carga**: Envoltura en `<Suspense>` con un componente `<Html>` que muestra un spinner animado dorado y porcentaje fluido (`useProgress`) durante la inicialización.
  - **Filtro de compatibilidad**: Verificación activa de WebGL y tamaño de pantalla mínima (>= 1024px) en [`StepSeats.tsx`](file:///c:/Users/sebas/OneDrive/Documentos/4-Proyectos/Riwi/ProyectoCinema/react-cinema-app/src/features/seatSelection/components/steps/StepSeats.tsx) para evitar problemas de visualización e interacción en dispositivos móviles.
- **Pendiente**:
  - Ninguno. Tarea Completada ✅

---

### 🔍 SCRUM-45: HU-FE-010 — Interactive seat selection
*Seleccionar asientos de forma interactiva en 2D/3D con tiempo de reserva.*

- **Hecho en tu código**:
  - Mapa interactivo de asientos en 2D (grilla A–F de 8 columnas).
  - Leyenda de estados (Estándar, VIP, Seleccionado, Ocupado).
  - Panel de resumen lateral que muestra el total calculado en tiempo real.
  - **Temporizador de Bloqueo Global**: Implementado contador regresivo de 10 minutos (600s) centralizado en [`SeatSelectionPage.tsx`](file:///c:/Users/sebas/OneDrive/Documentos/4-Proyectos/Riwi/ProyectoCinema/react-cinema-app/src/features/seatSelection/SeatSelectionPage.tsx) visible a lo largo de todo el proceso de compra (Asientos, Snacks y Pago).
  - **Alerta de salida con `useBlocker`**: Intercepción de cambio de rutas mediante React Router mostrando un modal estético y flotante animado con Framer Motion (diseño Swal-like oscuro y dorado).
  - **Alerta de salida con `beforeunload`**: Intercepción nativa ante recargas de página (F5) o cierres de pestaña.
  - **Integración con Backend**: Conexión con endpoints de `json-server` (con fallback dinámico a caché local si el servidor está apagado) para obtener distribución de funciones, bloquear asientos de forma persistente (`PATCH /functions/:id`) y registrar compras en `/reservations`.
- **Pendiente**:
  - Ninguno. Tarea Completada ✅

---

### 🔍 SCRUM-44: HU-FE-009 — Showtime and format selection
*Seleccionar complejo, fecha, sala, formato, idioma y horario.*

- **Hecho en tu código**:
  - Lista de horarios estáticos (showtimes) en `MovieCard` y `MovieDescriptionPage`.
  - **Selectores de UI en Stepper**:Dropdowns y selectores visuales premium maquetados e interactivos en [`StepShowtime.tsx`](file:///c:/Users/sebas/OneDrive/Documentos/4-Proyectos/Riwi/ProyectoCinema/react-cinema-app/src/features/seatSelection/components/steps/StepShowtime.tsx) para: Fecha de función, Complejo (Cine), Formato (2D, 3D, IMAX) e Idioma (Subt., Dobl.).
  - **Integración dinámica**: Consulta dinámica a `/functions?movieId=...` de la API para mapear y sincronizar la selección de filtros a la función activa del backend.
  - **Desactivación de horarios pasados**: Se implementó la regla de negocio que compara la hora de cada showtime contra la hora local de la máquina (`new Date()`). Si es para "Hoy", los horarios expirados se deshabilitan, tachan visualmente y se limpian automáticamente de la selección si ya estaban marcados.
- **Pendiente**:
  - Ninguno. Tarea Completada ✅

---

### 🔍 SCRUM-14: HU-FE-001 — Frontend platform setup
*Arquitectura base limpia, estructurada, dockerizada y testeada.*

- **Hecho en tu código**:
  - Inicialización del proyecto con Vite y TypeScript.
  - Estructura modular inicial (carpetas `features`, `router`, `shared`).
  - Configuración básica de ESLint.
  - **Contexto de Autenticación**: [`AuthContext.tsx`](file:///c:/Users/sebas/OneDrive/Documentos/4-Proyectos/Riwi/ProyectoCinema/react-cinema-app/src/shared/context/AuthContext.tsx) integrado y activo.
  - **Cliente HTTP Centralizado**: [`cinemaApi.ts`](file:///c:/Users/sebas/OneDrive/Documentos/4-Proyectos/Riwi/ProyectoCinema/react-cinema-app/src/shared/api/cinemaApi.ts) centralizado usando Fetch nativo, con soporte para reintentos y fallback a LocalStorage/Caché interna en caso de desconexión del servidor.
  - **Entorno de Simulación**: Integración de scripts concurrently en [`package.json`](file:///c:/Users/sebas/OneDrive/Documentos/4-Proyectos/Riwi/ProyectoCinema/react-cinema-app/package.json) para correr `json-server` y Vite de forma conjunta mediante `npm run dev:all`.
- **Pendiente**:
  - **Protección de Rutas**: Crear guards de rutas públicas y privadas para manejar la navegación.
  - **Pruebas Unitarias**: Configurar Vitest y escribir validaciones de componentes críticos.
  - **Docker**: Creación de Dockerfile y docker-compose.yml.
