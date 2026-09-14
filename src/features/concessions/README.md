# Concesiones

Este modulo permite elegir productos de la dulceria y agregarlos al carrito junto con los boletos.

## Que incluye

- Catalogo de productos con nombre, imagen, descripcion y precio.
- Filtro por categoria.
- Busqueda por nombre o descripcion.
- Indicadores de promocion.
- Estado de producto agotado.
- Selector para aumentar o disminuir cantidades.
- Carrito lateral con cantidad de productos.
- Total actualizado automaticamente.

## Archivos

- `ConcessionsPage.tsx`: contiene la pantalla, los filtros y el estado del carrito.
- `services.ts`: contiene las llamadas a la API y los datos de prueba.
- `types.ts`: define los tipos de productos, categorias y elementos del carrito.

## Flujo de la pantalla

1. Al entrar a la pantalla se cargan los productos y las categorias.
2. El usuario puede elegir una categoria o escribir una busqueda.
3. Un producto disponible se agrega con el boton `+`.
4. El boton `-` reduce la cantidad. Cuando llega a cero, el producto se elimina.
5. El carrito calcula la cantidad total y el importe sin recargar la pagina.
6. Los productos agotados se muestran deshabilitados y no se pueden agregar.

## API

La URL base se configura con la variable de entorno `VITE_API_URL`.

Si la variable no existe, la pantalla usa datos demo para poder probarse sin backend.
Si la API no responde, tambien se usa ese catalogo demo como respaldo.

Endpoints utilizados:

- `GET /snacks`: obtiene el catalogo.
- `GET /snacks/categories`: obtiene las categorias.
- `POST /cart/snacks`: agrega un producto al carrito.
- `PUT /cart/snacks`: actualiza la cantidad de un producto.
- `DELETE /cart/snacks`: elimina un producto. El `snackId` se envia en el cuerpo.

## Uso local

Inicia la aplicacion con:

```bash
npm run dev
```

Despues de iniciar sesion, abre `/concessions` desde el menu `Snacks`.

## Rutas y autenticacion

- `/`: pagina publica de inicio.
- `/auth/login`: formulario para iniciar sesion.
- `/auth/register`: formulario para crear una cuenta y volver al login.
- `/home`: cartelera protegida; se abre despues de un login correcto.
- `/concessions`: catalogo de snacks protegido.
- `/movies/:movieId`: detalle de una pelicula protegida.

El componente `ProtectedRoute` revisa la sesion antes de mostrar las pantallas privadas.
Si no existe `token_cine`, envia al usuario a `/auth/login`.

El menu superior muestra `Inicio` y `Login` en las paginas publicas. Despues del login muestra
`Cartelera`, `Snacks` y `Cerrar sesion`. Este ultimo elimina `token_cine` y `usuario_cine`
del almacenamiento local y vuelve al login.
