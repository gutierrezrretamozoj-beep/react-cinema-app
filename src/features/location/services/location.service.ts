// Importamos únicamente los TIPOS (interfaces).
// TypeScript los usa para validar el código, pero NO existen cuando la aplicación se ejecuta.
import type { Country, Department, City } from "../types/location.types";


// Guardamos la URL base de la API en una constante.
// Así evitamos escribir la misma dirección muchas veces.
// Si la API cambia, solo modificamos esta línea.
const BASE_URL = "https://countriesnow.space/api/v0.1";


// Exportamos la función para poder usarla desde otros archivos.
// async significa que esta función hará algo que toma tiempo (consultar una API).
// Promise<Country[]> indica que devolverá un arreglo de países.
export async function getCountries(): Promise<Country[]> {

  // fetch hace una petición HTTP a la API.
  // await espera hasta que el servidor responda.
  const response = await fetch(`${BASE_URL}/countries`);

  // La respuesta llega en formato JSON.
  // response.json() convierte ese JSON en un objeto de JavaScript.
  const data = await response.json();

  // La API devuelve algo parecido a:
  //
  // {
  //   error: false,
  //   msg: "...",
  //   data: [ ... ]
  // }
  //
  // Solo necesitamos el arreglo de países.
  return data.data;
}


// Esta función obtiene los departamentos de un país.
// Recibe como parámetro el nombre del país.
export async function getDepartments(
  countryName: string
): Promise<Department[]> {

  // Como la API necesita recibir información (el país),
  // usamos POST en lugar de GET.
  const response = await fetch(`${BASE_URL}/countries/states`, {

    // Indicamos el tipo de petición.
    method: "POST",

    // Le decimos al servidor que enviaremos un JSON.
    headers: {
      "Content-Type": "application/json",
    },

    // body es el contenido que enviamos al servidor.
    // JSON.stringify convierte un objeto de JavaScript en texto JSON.
    body: JSON.stringify({

      // Esto genera:
      //
      // {
      //    "country": "Colombia"
      // }
      country: countryName,
    }),
  });

  // Convertimos la respuesta del servidor a un objeto.
  const data = await response.json();

  // La respuesta de la API es:
  //
  // {
  //   data:{
  //      name:"Colombia",
  //      states:[ ... ]
  //   }
  // }
  //
  // Solo queremos el arreglo de departamentos.
  return data.data.states;
}



// Esta función obtiene las ciudades.
export async function getCities(
  countryName: string,
  stateName: string
): Promise<City[]> {

  // Nuevamente usamos POST porque enviamos información.
  const response = await fetch(`${BASE_URL}/countries/state/cities`, {

    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    // Enviamos dos datos:
    //
    // {
    //    country: "Colombia",
    //    state: "Atlántico"
    // }
    body: JSON.stringify({
      country: countryName,
      state: stateName,
    }),
  });

  // Convertimos el JSON recibido.
  const data = await response.json();

  // La API devuelve:
  //
  // data: [
  //   "Barranquilla",
  //   "Soledad",
  //   "Malambo"
  // ]
  //
  // Pero nuestro proyecto trabaja con objetos.
  // Por eso transformamos cada string en un objeto.
  return data.data.map((city: string) => ({
    name: city,
  }));
}