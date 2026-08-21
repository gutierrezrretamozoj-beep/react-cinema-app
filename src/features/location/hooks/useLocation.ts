import { startTransition, useEffect, useState } from "react";

import type {
  Country,
  Department,
  City,
} from "../types/location.types";

import {
  getCountries,
  getDepartments,
  getCities,
} from "../services/location.service";

import {
  saveLocation,
  getLocation,
} from "../utils/storage";

export function useLocation() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(() => {
    const savedLocation = getLocation();
    return savedLocation?.country ?? null;
  });

  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(() => {
    const savedLocation = getLocation();
    return savedLocation?.department ?? null;
  });

  const [selectedCity, setSelectedCity] = useState<City | null>(() => {
    const savedLocation = getLocation();
    return savedLocation?.city ?? null;
  });

  useEffect(() => {
    getCountries()
      .then(setCountries)
      .catch((error) =>
        console.error("Error al cargar países:", error)
      );
  }, []);

  useEffect(() => {
    if (!selectedCountry) {
      startTransition(() => {
        setDepartments([]);
        setCities([]);
      });
      return;
    }

    getDepartments(selectedCountry.name)
      .then(setDepartments)
      .catch((error) =>
        console.error("Error al cargar departamentos:", error)
      );
  }, [selectedCountry]);

  useEffect(() => {
    if (!selectedCountry || !selectedDepartment) {
      startTransition(() => setCities([]));
      return;
    }

    getCities(
      selectedCountry.name,
      selectedDepartment.name
    )
      .then(setCities)
      .catch((error) =>
        console.error("Error al cargar ciudades:", error)
      );
  }, [selectedCountry, selectedDepartment]);

  useEffect(() => {
    if (
      selectedCountry &&
      selectedDepartment &&
      selectedCity
    ) {
      saveLocation({
        country: selectedCountry,
        department: selectedDepartment,
        city: selectedCity,
      });
    }
  }, [
    selectedCountry,
    selectedDepartment,
    selectedCity,
  ]);

  return {
    countries,
    departments,
    cities,
    selectedCountry,
    selectedDepartment,
    selectedCity,
    setSelectedCountry,
    setSelectedDepartment,
    setSelectedCity,
  };
}