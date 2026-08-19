const BASE_URL = "https://countriesnow.space/api/v0.1";

export async function getCountries() {
  const response = await fetch(`${BASE_URL}/countries`);

  if (!response.ok) {
    throw new Error("Error al obtener los países");
  }

  const data = await response.json();

  return data.data.map((country: { country: string }, index: number) => ({
    id: index + 1,
    name: country.country,
  }));
}

export async function getDepartments(countryName: string) {
  const response = await fetch(`${BASE_URL}/countries/states`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      country: countryName,
    }),
  });

  if (!response.ok) {
    throw new Error("Error al obtener los departamentos");
  }

  const data = await response.json();

  return data.data.states.map(
    (state: { name: string }, index: number) => ({
      id: index + 1,
      name: state.name,
      countryId: 0,
    })
  );
}

export async function getCities(
  countryName: string,
  stateName: string
) {
  const response = await fetch(`${BASE_URL}/countries/state/cities`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      country: countryName,
      state: stateName,
    }),
  });

  if (!response.ok) {
    throw new Error("Error al obtener las ciudades");
  }

  const data = await response.json();

  return data.data.map((city: string, index: number) => ({
    id: index + 1,
    name: city,
    departamentId: 0,
    isActive: true,
  }));
}