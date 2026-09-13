import { startTransition, useEffect, useState } from "react";
import type { Country } from "@/shared/interfaces/country";
import type { Department } from "@/shared/interfaces/department";
import type { City } from "@/shared/interfaces/city";
import { countryService } from "@/shared/services/country.service";
import { departmentService } from "@/shared/services/department.service";
import { cityService } from "@/shared/services/city.service";
import { saveLocation, getLocation } from "../utils/storage";

/**
 * Hook managing country/department/city selection with real backend services.
 * @returns Location state and setters
 */
export function useLocation() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(() => {
    const saved = getLocation() as { country?: Country } | null;
    return saved?.country ?? null;
  });

  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(() => {
    const saved = getLocation() as { department?: Department } | null;
    return saved?.department ?? null;
  });

  const [selectedCity, setSelectedCity] = useState<City | null>(() => {
    const saved = getLocation() as { city?: City } | null;
    return saved?.city ?? null;
  });

  useEffect(() => {
    countryService.getAll().then(setCountries).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedCountry) {
      startTransition(() => {
        setDepartments([]);
        setCities([]);
      });
      return;
    }
    departmentService
      .getByCountryId(selectedCountry.id)
      .then(setDepartments)
      .catch(console.error);
  }, [selectedCountry]);

  useEffect(() => {
    if (!selectedDepartment) {
      startTransition(() => setCities([]));
      return;
    }
    cityService
      .getByDepartmentId(selectedDepartment.id)
      .then(setCities)
      .catch(console.error);
  }, [selectedDepartment]);

  useEffect(() => {
    if (selectedCountry && selectedDepartment && selectedCity) {
      saveLocation({
        country: selectedCountry,
        department: selectedDepartment,
        city: selectedCity,
      });
    }
  }, [selectedCountry, selectedDepartment, selectedCity]);

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
