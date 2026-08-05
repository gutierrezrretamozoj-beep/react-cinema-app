# Cartelera de Cine - Página de Inicio (Home)

Este módulo contiene la lógica y los componentes de la cartelera interactiva de cine.

## Estructura de Archivos

```text
Home/
├── HomePage.tsx               # Componente y controlador principal de la cartelera
├── README.md                  # Documentación del módulo
├── components/
│   ├── Badge.tsx              # Insignias modulares reutilizables
│   ├── FeaturedCarousel.tsx   # Carrusel panorámico de películas destacadas
│   └── MovieCard.tsx          # Tarjeta de película con forma de boleto y rasgado 3D
└── data/
    └── movieData.ts           # Interfaz de datos y base de datos estática
```

---

## Funcionalidades y Componentes

### 1. `HomePage.tsx`
* **Filtros Reactivos**: Gestiona la cartelera ("En Cartelera" / "Próximamente"), categorías por género y filtros rápidos por hora.
* **Enfoque Inteligente**: Al hacer clic en comprar desde el carrusel de destacados, la página cambia automáticamente de pestaña/género para asegurar la visibilidad del boleto, se desplaza suavemente hasta él y añade un anillo dorado temporal de enfoque (`ring-2 ring-yellow-500 scale-105`) por 2 segundos.
* **Notificaciones**: Despliega alertas Toast flotantes con temporizador de auto-cierre de 4 segundos.

### 2. `FeaturedCarousel.tsx`
* **Transiciones Cinemáticas**: Animación de fundido cruzado y escala al alternar imágenes panorámicas de fondo (*backdrops*).
* **Autoplay Inteligente**: Avanza cada 5 segundos de forma automática. La reproducción se pausa al colocar el cursor sobre el carrusel y se reanuda al salir.
* **Navegación Manual**: Botones flotantes laterales y dots de salto rápido.

### 3. `MovieCard.tsx`
* **Diseño de Boleto Real**: Estructura dividida (Cuerpo, Divisor y Talón) que evita líneas de borde pasando por las muescas.
* **Muescas Estilo Login**: Máscaras circulares en los laterales de color sólido `bg-neutral-950` sin bordes propios, integrándose limpiamente con el fondo.
* **Desgarre 3D**: Al seleccionar un horario y confirmar la compra, el talón rota sobre los tres ejes de perspectiva 3D y cae por gravedad (aunque actualmente parece una tabla cayendo y no un papel rasgado). Al finalizar la animación, se revela el ticket con código de barras digital (se puede cambiar o mejorar implementando un QR junto con un texto que diga "escanea el codigo o revisa tu correo para ver tu boleto").

### 4. `Badge.tsx`
* Componente modular y consistente con bordes **`rounded-lg`** para consistencia con el diseño de las cards y peliculas destacadas.
* **Variantes**: Géneros, clasificaciones por edad (verde para A/B, amarillo para B15, rojo para C), etiqueta "Destacada" y etiqueta "Precompra".

### 5. `movieData.ts`
* Define la interfaz `Movie` y contiene el arreglo `MOVIES` de 8 películas con imágenes y horarios configurados.

---

## Sistema de Precompra (Preventas)
Para evitar que el usuario asuma que verá la película inmediatamente tras la compra de un próximo estreno (`status === 'coming-soon'`):
1. Se muestra una insignia violeta pulsante con el texto **"Precompra"** junto al género.
2. La etiqueta de los botones de llamada a la acción cambia dinámicamente de "Comprar" a **"Precomprar Ticket / Boleto"**.
3. El mensaje Toast final de confirmación indica que se trata de una preventa para el estreno oficial.
