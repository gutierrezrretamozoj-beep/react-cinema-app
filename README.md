# 🎬 Cinema Nova — Aplicación Web de Reserva Cinematográfica 3D & 2D

Cinema Nova es una aplicación web moderna de reserva y venta de entradas de cine construida con **React 19**, **TypeScript**, **Tailwind CSS v4** y una experiencia inmersiva en **3D con Three.js / React Three Fiber**.

Permite a los usuarios consultar cartelera, seleccionar funciones en múltiples teatros y días, elegir asientos en mapas 2D y visores 3D en primera persona, adquirir snacks en confitería, realizar el pago con animación de rasgado de boleto físico y descargar su entrada digital en alta resolución.

---

## 🚀 Guía de Instalación y Ejecución

El proyecto cuenta con un servidor frontend interactivo (Vite) y una API simulada de persistencia con `json-server` (`db.json`).

### 1. Requisitos Previos
- **Node.js** v18.0 o superior
- **npm** v9.0 o superior

### 2. Instalación de Dependencias
```bash
npm install
```

### 3. Ejecución del Proyecto

Puedes correr ambos servidores simultáneamente o en terminales separadas:

#### Opción A: Ejecución Simultánea (Recomendada)
Ejecuta concurrentemente el servidor de desarrollo y la API de datos:
```bash
npm run dev:all
```

#### Opción B: Ejecución en Terminales Separadas
- **Terminal 1 — API Mock (json-server):**
  ```bash
  npm run server
  ```
  *Corre en `http://localhost:5000` leyendo y persistiendo en `db.json` (funciones, teatros, reservas y películas).*
  
  > **Nota de Resiliencia:** Si `json-server` no está corriendo, la aplicación cuenta con un **fallback offline automático** en [`cinemaApi.ts`](file:///c:/Users/sebas/OneDrive/Documentos/4-Proyectos/Riwi/ProyectoCinema/react-cinema-app/src/shared/api/cinemaApi.ts), por lo que la app seguirá funcionando fluidamente sin romperse.

- **Terminal 2 — Aplicación Frontend (Vite):**
  ```bash
  npm run dev
  ```
  *Abre `http://localhost:5173` en tu navegador.*

### 4. Compilación para Producción
Para validar tipados de TypeScript y generar el bundle optimizado:
```bash
npm run build
```

---

## 📋 Resumen de Mejoras y Justificación Técnica

A continuación se detallan las decisiones de arquitectura, diseño e ingeniería aplicadas en la última versión:

### 1. Inmersión y Calibración de Sala 3D IMAX
* **El Problema:** Al ampliar la pantalla un 20% para salas IMAX, en configuraciones previas la pantalla se salía del ancho del teatro incrustándose en las paredes, y en la fila A la pantalla se cortaba en los laterales por proximidad. Luego, al alejarla a `5.5`, la sala se sentía desproporcionadamente vacía y lejana.
* **La Solución Implementada:**
  - **Ensanchamiento Arquitectónico:** Se incrementó el ancho de la sala IMAX a `roomWidth = 32` (frente a 23 en salas estándar) y se colocó un muro frontal sólido (`frontWallZ = -19.5`) que sella la escena y aloja perfectamente la pantalla de $27.4 \times 15.84$ sin cortes.
  - **Calibración de Distancia Óptima (`baseDistanceZ = 3.2`):** Sincronizada entre las butacas de [`seatData.ts`](file:///c:/Users/sebas/OneDrive/Documentos/4-Proyectos/Riwi/ProyectoCinema/react-cinema-app/src/features/seatSelection/data/seatData.ts) y las plataformas de stadium seating de [`CinemaRoom3D.tsx`](file:///c:/Users/sebas/OneDrive/Documentos/4-Proyectos/Riwi/ProyectoCinema/react-cinema-app/src/features/seatSelection/components/cinema3d/CinemaRoom3D.tsx).
  - **Campo de Visión Dinámico (FOV Adaptativo):** En [`CinemaCamera3D.tsx`](file:///c:/Users/sebas/OneDrive/Documentos/4-Proyectos/Riwi/ProyectoCinema/react-cinema-app/src/features/seatSelection/components/cinema3d/CinemaCamera3D.tsx), la cámara abre progresivamente su FOV hasta $80^\circ$ en la fila frontal A y lo estrecha en la fila trasera H, logrando que el espectador vea la pantalla completa sin distorsión.

### 2. Iluminación Cinemática Realista (0.005)
* **La Justificación:** En una sala de cine real, durante la proyección del filme las luces del auditorio están completamente apagadas.
* **La Solución:** En [`CinemaLights3D.tsx`](file:///c:/Users/sebas/OneDrive/Documentos/4-Proyectos/Riwi/ProyectoCinema/react-cinema-app/src/features/seatSelection/components/cinema3d/CinemaLights3D.tsx), la luz ambiental se mantiene fija en `0.005` y la luz cenital en `0.04`. Esto permite que la luz emitida por el video proyectado en el lienzo sea la protagonista que ilumina las butacas y paredes con **cero impacto en rendimiento de GPU**.

### 3. Prevención de Asientos Huérfanos (Single Orphan Seat Gap Rule)
* **La Regla de Negocio:** Los cines reales no permiten que un comprador deje un asiento individual vacío entre dos asientos ocupados o entre un asiento y el pasillo, ya que una sola butaca aislada es difícil de comercializar.
* **La Solución:** La función algorítmica `checkOrphanSeats` analiza la fila y el bloque del pasillo. Si el usuario intenta seleccionar una butaca dejando un espacio de 1 solo asiento libre, se activa una advertencia interactiva animada con icono de alerta y sonido preventivo háptico, orientando al usuario a elegir butacas continuas.

### 4. Descarga del Boleto Digital en Imagen PNG
* **La Necesidad:** Los usuarios desean guardar su entrada en la galería de fotos del móvil o computadora para presentarla offline en el cine.
* **La Solución:** Implementado en [`ticketGenerator.ts`](file:///c:/Users/sebas/OneDrive/Documentos/4-Proyectos/Riwi/ProyectoCinema/react-cinema-app/src/features/seatSelection/utils/ticketGenerator.ts) mediante **HTML5 Canvas 2D nativo** en resolución Retina 2x ($800 \times 1150\text{ px}$). Dibuja el marco dorado, banner de película, detalles técnicos, corte perforado de boleto físico, código QR escaneable y clave de reserva sin añadir librerías externas pesadas que engorden la aplicación.

### 5. Asientos Accesibles para Personas con Movilidad Reducida
* **Inclusión y Accesibilidad:** La fila frontal A incluye butacas accesibles para sillas de ruedas identificadas con el icono `Accessibility`, borde cian/celeste y tarifa ajustada ($8.50). El indicador es visible tanto en el plano 2D como en la sala 3D y en la leyenda de sala.

### 6. Motor de Sonido y Háptica Web Audio API
* **Zero Assets (0 KB extra):** En [`soundEffects.ts`](file:///c:/Users/sebas/OneDrive/Documentos/4-Proyectos/Riwi/ProyectoCinema/react-cinema-app/src/features/seatSelection/utils/soundEffects.ts), no se emplean archivos `.mp3` externos que causen retardos de red o errores 404. El navegador sintetiza ondas sinusoidales y filtros en tiempo real para:
  - Clic mecánico al seleccionar butaca.
  - Tono sutil al deseleccionar.
  - Pulso sonoro de advertencia al provocar un asiento huérfano.
  - Transición acústica fluida entre pasos del checkout.
  - Fanfarria triunfal en Do Mayor al confirmar la compra en el Paso 5.
  - Vibración táctil (`navigator.vibrate`) en dispositivos móviles compatibles.
  - Botón de control `SFX ON / OFF` en la cabecera del plano.

### 7. Puntos de Fidelidad (Nova Credits)
* **Gamificación del Checkout:**
  - El usuario acumula el 10% del total de su compra en Nova Credits (ej. \$24.00 = +240 pts).
  - En el Paso 4 (Pago), el usuario puede activar la casilla *"Canjear 100 Nova Credits"* para recibir un descuento directo de -\$5.00 sobre su compra.
  - En el Paso 5 (Boleto), se presenta una tarjeta de recompensa con animación dorada confirmando los puntos ganados.

### 8. Datos Realistas Multi-Día y Multi-Sala
* Se enriqueció [`db.json`](file:///c:/Users/sebas/OneDrive/Documentos/4-Proyectos/Riwi/ProyectoCinema/react-cinema-app/db.json) y [`cinemaApi.ts`](file:///c:/Users/sebas/OneDrive/Documentos/4-Proyectos/Riwi/ProyectoCinema/react-cinema-app/src/shared/api/cinemaApi.ts) con funciones para diferentes días (*Hoy, Mañana, Sáb 22, Dom 23*), teatros (*Multicine Viva Barranquilla*, *Multiplex Buenavista*) y salas (*Sala 1 IMAX* con 80 asientos, *Sala 4 4DX* con 48 asientos, *Sala 2 Kids*). Al cambiar de función, la grilla 2D y 3D se reconfigura en tiempo real.

---

## 🧪 Guía Práctica de Pruebas (Paso a Paso)

Para verificar todas las funcionalidades en tu navegador:

1. **Selección de Función (Paso 1):**
   - Entra a la cartelera y haz clic en *"Comprar Boletos"* en cualquier película.
   - Selecciona entre los días disponibles (*Hoy, Mañana, Sáb 22*) y elige la función **IMAX** para probar la sala de 80 butacas o **4DX/Estándar** para la de 48 butacas.
2. **Plano 2D y Asientos Accesibles (Paso 2):**
   - Observa las esquinas de la fila A: verás los asientos con icono de silla de ruedas en color cian ($8.50).
   - Haz clic en cualquier asiento para escuchar el sonido mecánico y sentir la háptica.
3. **Prueba de Prevención de Asiento Huérfano:**
   - En una fila libre (ej. Fila D), selecciona el asiento `D-1` y luego haz clic en `D-3`.
   - Observa cómo aparece inmediatamente el banner ámbar: *"Aviso de aforo: La selección deja una butaca individual libre (D-2)"* junto con el sonido de advertencia.
4. **Exploración 3D en Primera Persona:**
   - Con al menos un asiento seleccionado, haz clic en el botón dorado **"Explorar sala en 3D"**.
   - Verás la sala a oscuras (`0.005`), el resplandor vivo de la pantalla gigante proyectando el tráiler, y la cámara situada exactamente a la altura de tus ojos en la butaca seleccionada.
   - Haz clic y arrastra con el ratón para mirar a tu alrededor (mouse-look) o conmuta al minimapa superior derecho para cambiar de butaca en vivo.
5. **Confitería (Paso 3):**
   - Agrega combos de palomitas, gaseosas o nachos y avanza al pago.
6. **Canje de Nova Credits (Paso 4):**
   - En el desglose de pago, marca la casilla *"Canjear 100 Nova Credits"*.
   - Comprueba que el total neto se reduce automáticamente en **-\$5.00**.
   - Completa los datos de tarjeta y haz clic en **Pagar**: observa la animación física de rasgado y enrollado del boleto.
7. **Descarga del Boleto PNG (Paso 5):**
   - Escucharás la fanfarria musical de confirmación y verás tu saldo de Nova Credits acumulados.
   - Haz clic en **"Descargar Boleto (PNG)"**: se generará y descargará en tu navegador la imagen en alta definición con tu código QR y datos de la función.
