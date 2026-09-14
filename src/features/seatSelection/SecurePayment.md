## Task: Pago de peliculas

### Realizado

- Se implemento el paso de pago dentro del flujo de seleccion de asientos.
- Se agregaron los medios de pago:
	- Tarjeta de credito.
	- Tarjeta debito.
	- PSE.
	- Nequi.
	- Daviplata.
- Se agregaron los estados de la transaccion:
	- Procesando.
	- Aprobado.
	- Rechazado.
	- Pendiente.
- Se agrego la consulta del estado para pagos pendientes mediante `GET /payments/status`.
- Se agrego la creacion de pagos mediante `POST /payments`.
- Se agrego la creacion de ordenes mediante `POST /orders`.
- Se valida que el carrito exista, tenga productos y no este vencido antes de confirmar la orden.
- El boton de pago se bloquea despues del primer envio para evitar compras duplicadas.
- Los datos de tarjeta permanecen unicamente en el estado temporal del formulario y no se envian al backend ni se guardan en el frontend.
- Los pagos rechazados muestran un mensaje claro y permiten reintentar.
- Los pagos aprobados muestran el numero de orden en la confirmacion.
- Despues del pago aprobado se elimina el carrito persistido y se limpia tambien su estado global en memoria.
- Se limpian los datos temporales de la reserva y de confiteria despues del pago exitoso.

### Observacion: recarga de la pagina

Al agregar un ticket desde la cartelera, la aplicacion parecia recargarse. El boton no estaba provocando un `submit` ni una navegacion: el problema ocurria porque `json-server` actualizaba `db.json` al guardar el carrito y Vite detectaba ese cambio como una modificacion del proyecto, activando el recargado o HMR.

La solucion fue excluir `db.json` del watcher de Vite en `vite.config.ts`:

```ts
server: {
	watch: {
		ignored: ['**/db.json'],
	},
},
```

Adicionalmente, el boton de compra se definio con `type="button"` y se cancela el comportamiento por defecto del evento. De esta forma, el ticket se agrega sin cambiar la ruta ni recargar la pagina.
