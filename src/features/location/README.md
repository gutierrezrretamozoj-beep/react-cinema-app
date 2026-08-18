# 📍 Location Feature

La carpeta `location` contiene toda la funcionalidad relacionada con la **selección y gestión de ubicaciones geográficas** en la aplicación de cines. Proporciona componentes reutilizables, servicios de API y hooks personalizados para manejar países, departamentos y ciudades.

---

## 📁 Estructura del Proyecto

```
location/
├── components/          # Componentes React reutilizables
├── hooks/              # Hooks personalizados de React
├── services/           # Servicios y lógica de API
├── types/              # Definiciones de tipos e interfaces
├── utils/              # Utilidades y funciones auxiliares
└── README.md          # Este archivo
```

---

## 🎨 Componentes (`components/`)

### **LocationWizard.tsx**
Componente modal interactivo para la selección de ubicación paso a paso.

**Props:**
```typescript
interface LocationWizardProps {
  isOpen: boolean;                              // Controla la visibilidad del modal
  countries: LocationOption[];                  // Lista de países disponibles
  departments: LocationOption[];                // Lista de departamentos
  cities: LocationOption[];                     // Lista de ciudades
  selection: LocationSelection;                 // Ubicación actualmente seleccionada
  onCountryChange: (countryId: string | number) => void;
  onDepartmentChange: (departmentId: string | number) => void;
  onCityChange: (cityId: string | number) => void;
  onConfirm: () => void;                       // Callback al confirmar
  onClose?: () => void;                        // Callback al cerrar
}
```

**Características:**
- Modal con tema oscuro y estilo premium
- Selects en cascada (país → departamento → ciudad)
- Validación: desactiva departamento/ciudad hasta que se seleccione el anterior
- Botón de confirmación desactivado hasta completar la selección
- Accesibilidad ARIA incluida
- Animaciones suaves con Tailwind CSS

**Ejemplo de uso:**
```typescript
<LocationWizard
  isOpen={isOpen}
  countries={countries}
  departments={departments}
  cities={cities}
  selection={selection}
  onCountryChange={handleCountryChange}
  onDepartmentChange={handleDepartmentChange}
  onCityChange={handleCityChange}
  onConfirm={handleConfirm}
  onClose={handleClose}
/>
```

---

### **LocationSelector.tsx**
Botón compacto para mostrar y cambiar la ubicación seleccionada.

**Props:**
```typescript
interface LocationSelectorProps {
  locationName: string;  // Nombre de la ubicación actual
  onClick: () => void;   // Callback al hacer clic
}
```

**Características:**
- Botón con ícono de ubicación (pin map)
- Estilos hover interactivos
- Diseño responsive
- Accesibilidad ARIA

**Ejemplo de uso:**
```typescript
<LocationSelector
  locationName="Bogotá, Colombia"
  onClick={() => setIsLocationWizardOpen(true)}
/>
```

---

### **LocationSelect.tsx** y **LocationModal.tsx**
Componentes adicionales para casos de uso específicos.

---

## 🔧 Servicios (`services/`)

### **location.service.ts**
Servicio que se conecta con la API **CountriesNow** para obtener datos geográficos.

**Base URL:** `https://countriesnow.space/api/v0.1`

#### Funciones Exportadas:

**`getCountries(): Promise<Country[]>`**
Obtiene la lista de todos los países.

```typescript
const countries = await getCountries();
// Retorna: [{ id: 1, name: "Colombia" }, ...]
```

**`getDepartments(countryName: string): Promise<Department[]>`**
Obtiene los departamentos/estados de un país específico.

```typescript
const departments = await getDepartments("Colombia");
// Retorna: [{ id: 1, name: "Bogotá D.C.", countryId: 1 }, ...]
```

**`getCities(countryName: string, stateName: string): Promise<City[]>`**
Obtiene las ciudades de un departamento específico.

```typescript
const cities = await getCities("Colombia", "Cundinamarca");
// Retorna: [{ id: 1, name: "Bogotá", departamentId: 1, isActive: true }, ...]
```

**Características:**
- Todas las funciones son `async`
- Comentarios detallados en el código explicando cada paso
- Manejo automático de conversión JSON
- Peticiones HTTP con método POST/GET según corresponda

---

## 📦 Tipos (`types/`)

### **location.types.ts**
Definiciones de interfaces TypeScript para tipado fuerte.

```typescript
// País
export interface Country {
  id: number;
  name: string;
}

// Departamento / Estado
export interface Department {
  id: number;
  name: string;
  countryId: number;
}

// Ciudad
export interface City {
  id: number;
  name: string;
  departamentId: number;
  isActive: boolean;
}
```

### **indextypes.ts**
Tipos adicionales para componentes.

```typescript
// Opción genérica para selects
export interface LocationOption {
  id: string | number;
  name: string;
  active?: boolean;
}

// Selección actual del usuario
export interface LocationSelection {
  country: string | number;
  department: string | number;
  city: string | number;
}
```

---

## 🎯 Hooks (`hooks/`)

### **useLocation.ts**
Hook personalizado para manejar la lógica de ubicación (actualmente vacío, listo para expandir).

**Uso futuro previsto:**
```typescript
const { 
  selection, 
  countries, 
  departments, 
  cities, 
  setCountry, 
  setDepartment, 
  setCity 
} = useLocation();
```

---

## 💾 Utilidades (`utils/`)

### **storage.ts**
Utilidad para persistencia de ubicación en localStorage (actualmente vacía, lista para implementar).

**Uso futuro previsto:**
```typescript
// Guardar ubicación seleccionada
saveLocationToStorage(selection);

// Cargar ubicación guardada
const savedLocation = loadLocationFromStorage();
```

---

## 🚀 Flujo de Uso Recomendado

1. **Renderizar el selector:** Mostrar `LocationSelector` en la navbar o header
2. **Abrir wizard:** Al hacer clic, mostrar `LocationWizard`
3. **Cargar datos:** Usar `getCountries()` para poblar el primer select
4. **En cascada:** Cuando el usuario selecciona país → cargar departamentos
5. **Confirmar:** Guardar la selección y cerrar el modal
6. **Persistencia:** Guardar en localStorage (implementar en `storage.ts`)

---

## 🎨 Estilos

Todos los componentes utilizan **Tailwind CSS** con la siguiente paleta:
- Fondo: `neutral-900`, `neutral-950`
- Texto: `neutral-100`, `neutral-200`, `neutral-300`
- Bordes: `neutral-700`, `neutral-800`
- Accento: `yellow-500`, `yellow-400`

Ejemplo de clases utilizadas:
```css
rounded-xl          /* Bordes redondeados */
border-neutral-800  /* Bordes sutiles */
bg-neutral-900      /* Fondo oscuro */
text-yellow-500     /* Accento amarillo */
hover:border-yellow-500/40
transition           /* Animaciones suaves */
```

---

## ⚙️ Configuración y Extensiones

### Próximas Mejoras Recomendadas:

1. **`useLocation` Hook:**
   - Implementar lógica de estado centralizada
   - Manejar errores de API
   - Caché de datos

2. **`storage.ts` Utilities:**
   - Guardar/cargar ubicación en localStorage
   - Cargar ubicación al iniciar app

3. **Error Handling:**
   - Manejo de errores de red en servicios
   - Toast notifications para errores

4. **Testing:**
   - Tests unitarios para servicios
   - Tests de componentes con React Testing Library

---

## 📝 Notas Técnicas

- Los tipos se importan con `import type { ... }` para evitar sobrecarga de bundling
- Todos los fetch calls incluyen comentarios explicativos
- La API CountriesNow es pública y no requiere autenticación
- Los componentes están construidos con accesibilidad ARIA en mente

---

## 🔗 Recursos Externos

- **CountriesNow API:** https://countriesnow.space/
- **Tailwind CSS:** https://tailwindcss.com/
- **React Docs:** https://react.dev/

---

**Última actualización:** 2026-08-14
