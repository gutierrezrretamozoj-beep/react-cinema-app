const LOCATION_KEY = "user-location";

export function saveLocation(location: unknown) {
  localStorage.setItem(LOCATION_KEY, JSON.stringify(location));
}

export function getLocation() {
  const location = localStorage.getItem(LOCATION_KEY);

  if (!location) {
    return null;
  }

  return JSON.parse(location);
}

export function clearLocation() {
  localStorage.removeItem(LOCATION_KEY);
}