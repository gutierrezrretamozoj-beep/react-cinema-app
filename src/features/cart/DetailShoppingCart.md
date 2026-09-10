# Implementación del carrito de compras

## Alcance

Se implementó el flujo de carrito para usuarios autenticados y sesiones invitadas, manteniendo el stepper existente de selección de película, función, asientos, confitería y pago. El carrito funciona con el backend configurado en `http://localhost:5000` y conserva un fallback en `localStorage` para desarrollo sin `json-server`.

## Archivos creados

| Archivo | Responsabilidad |
| --- | --- |
| `src/features/cart/CartPage.tsx` | Pantalla de revisión del carrito: tickets, confitería, cantidades, eliminación, descuentos, impuestos, expiración y navegación al pago. |
| `src/features/cart/DetailShoppingCart.md` | Documentación de archivos, lógica, endpoints, validación y nivel de cumplimiento. |
| `src/features/cart/CartContext.tsx` | Estado compartido del carrito, agregado de tickets desde botones de compra, alerta dinámica y carrito flotante global. |

## Archivos modificados

| Archivo | Cambios |
| --- | --- |
| `src/shared/api/cinemaApi.ts` | Se agregaron los tipos `Cart` y `CartItem`, persistencia local y métodos para crear, consultar, actualizar, eliminar y aplicar descuentos al carrito. |
| `src/features/seatSelection/SeatSelectionPage.tsx` | Convierte asientos y snacks seleccionados en items del carrito, crea o actualiza el carrito y lo elimina después de registrar la reserva. También restaura la selección al volver desde el carrito. |
| `src/router/index.tsx` | Se agregó la ruta `/cart` protegida para usuarios autenticados y un `ProtectedRoute` para el historial de tickets en `/tickets`. |
| `src/shared/components/Navbar.tsx` | Se agregó el acceso visual a la pantalla del carrito. |
| `db.json` | Se agregó la colección `carts` para `json-server`. |
| `src/App.tsx` | Se agregó `CartProvider` para compartir el carrito en toda la aplicación. |
| `src/features/auth/pages/Home/HomePage.tsx` | El callback de compra agrega el ticket pendiente al carrito y conserva el aviso existente. |
| `src/features/auth/pages/Home/components/MovieCard.tsx` | Comprar ticket deja de navegar inmediatamente y delega el agregado al callback. |
| `src/features/auth/pages/MoviewDescripcion/MovieDescriptionPage.tsx` | Comprar entradas agrega el ticket pendiente sin enviar al mapa de asientos. |

## Lógica implementada

### Creación y actualización

1. El usuario selecciona uno o más asientos.
2. Al avanzar a confitería o pago, `SeatSelectionPage` crea el carrito si no existe.
3. Si ya existe, se conserva su identificador y los descuentos aplicados, y se ejecuta una actualización.
4. Cada ticket se guarda como un item individual para conservar el asiento asociado.
5. La confitería se guarda agrupada por producto con una cantidad no negativa.
6. Las compras rápidas de películas diferentes se acumulan en el mismo carrito; al confirmar asientos sólo se reemplazan los items pendientes de la película actual.

### Consulta y persistencia

`CartPage` consulta el carrito usando el correo del usuario autenticado o el propietario `guest` si no hay sesión. Las operaciones intentan usar los endpoints HTTP y, cuando el servidor no responde, usan `localStorage` con la clave `cinema_cart_<correo>` o `cinema_cart_guest`. `CartProvider` vuelve a consultar el carrito cada 5 segundos para mantener actualizado el contador global.

### Precios

- Subtotal: suma de `unitPrice * quantity` de todos los items.
- Descuentos: membresía más gift card.
- Impuestos: 19% sobre el subtotal después de descuentos.
- Total: subtotal menos descuentos más impuestos, sin permitir valores finales negativos.

### Descuentos

La pantalla permite aplicar:

- Membresía mediante `POST /cart/apply-membership`.
- Gift card mediante `POST /cart/apply-giftcard`.

Para la demo local se reconocen los códigos `NOVA10` y `REGALO25`. Si los endpoints no están disponibles, se actualiza el carrito mediante `PUT /cart` y el fallback local.

### Expiración y navegación

El carrito guarda `expiresAt`, muestra una alerta cuando el tiempo terminó y deshabilita continuar al pago. El botón de editar asientos devuelve al mapa conservando la película y función seleccionadas. El botón de pago devuelve al stepper en el paso 4.

### Limpieza

Después de confirmar la reserva y registrar el ticket, se ejecuta `DELETE /cart`. En modo offline también se elimina el carrito local.

### Compra rápida y carrito flotante

Los botones de compra de las tarjetas y del detalle crean un item pendiente con película, horario y precio base. No se navega automáticamente al mapa de asientos. `FloatingCart` se monta en `PageShell`, muestra una alerta temporal y un acceso fijo en la esquina superior derecha. Se oculta en `/cart` y para toda la ruta `/movies/:movieId/seats`, que contiene los pasos de horario, asientos, confitería y pago. El contador muestra sólo la suma de cantidades de items tipo `ticket` y se sincroniza cada 5 segundos. Al entrar después al stepper, la selección real de asientos reemplaza el item pendiente.

### Protección de autenticación

Las rutas `/cart` y `/tickets` requieren una sesión activa. Si el usuario no está autenticado, `/cart` muestra un aviso con acceso a login y `/tickets` redirige a `/auth/login`, conservando la ruta solicitada en el estado de navegación. La cartelera, el detalle de película y la selección de compra permanecen disponibles sin iniciar sesión.

## Endpoints cubiertos

| Método | Endpoint | Uso |
| --- | --- | --- |
| `POST` | `/cart` | Crear el carrito al confirmar selección. |
| `GET` | `/cart` | Recuperar el carrito activo del usuario. |
| `PUT` | `/cart` | Actualizar cantidades, items o fallback de descuentos. |
| `DELETE` | `/cart` | Vaciar el carrito después de la compra. |
| `POST` | `/cart/apply-membership` | Aplicar descuento de membresía. |
| `POST` | `/cart/apply-giftcard` | Aplicar descuento de gift card. |

## Nivel de cumplimiento de la task

**Cumplimiento estimado: 90%.**

| Criterio | Estado | Observación |
| --- | --- | --- |
| Página de carrito | Cumplido | Disponible en `/cart`. |
| Resumen de tickets | Cumplido | Cada asiento se muestra como item. |
| Resumen de confitería | Cumplido | Items agrupados y editables por cantidad. |
| Desglose de precios | Cumplido | Subtotal, descuentos, impuestos y total. |
| Descuentos y promociones | Cumplido | Membresía y gift card con códigos demo y endpoints. |
| Temporizador | Cumplido | Usa `expiresAt` y notifica expiración. |
| Editar asientos | Cumplido | Regresa al mapa de asientos. |
| Eliminar items | Cumplido | Botón individual y cantidades con mínimo cero. |
| Continuar a selección de asientos | Cumplido | Regresa al inicio del flujo de asientos, sin saltar directamente al pago. |
| Crear carrito al confirmar asientos | Cumplido | Se crea al avanzar desde asientos. |
| Recuperar carrito activo | Cumplido | Consulta por usuario autenticado. |
| Limpiar tras compra | Cumplido | Se ejecuta después de registrar la reserva. |
| Backend real completo | Parcial | Los endpoints están integrados, pero el fallback local sigue siendo necesario mientras el backend no implemente todas las rutas. |

## Validación

- `npm run build`: correcto.
- Verificación TypeScript de los archivos relacionados: sin errores.
- `npm run lint`: mantiene errores preexistentes en otros componentes del proyecto y reglas de efectos React; no se corrigieron porque están fuera del alcance del carrito.
