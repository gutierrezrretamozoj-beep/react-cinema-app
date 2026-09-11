// Navbar.tsx — Barra de navegacion superior con visibilidad condicional segun el estado de sesion
// Como desarrollador junior, condicionamos los enlaces: si no hay sesion, solo Inicio y Login; si hay sesion, mostramos Cartelera, Dulceria y Carrito

import { Link, useLocation } from "react-router";
// Importamos useAuth para conocer si el usuario tiene sesion activa y poder cerrar sesion
import { useAuth } from "@/shared/context/AuthContext";

export const Navbar = () => {
  // Obtenemos el objeto user (null si no esta autenticado) y la funcion logout del contexto global
  const { user, logout } = useAuth();
  // Obtenemos la ubicacion actual para marcar visualmente el enlace activo
  const location = useLocation();

  // Definimos la lista de enlaces segun el requerimiento exacto:
  // - Si el usuario NO esta logueado: unicamente 'Inicio' y 'Login'
  // - Si el usuario SI esta logueado: 'Inicio', 'Cartelera', 'Carrito' y 'Mis Boletos'
  // La dulceria se accede desde el flujo de compra de boletos, no directamente desde el navbar
  const navLinks = user
    ? [
        { path: "/", label: "Inicio" },
        { path: "/home", label: "Cartelera" },
        { path: "/cart", label: "Carrito" },
        { path: "/tickets", label: "Mis Boletos" },
      ]
    : [
        { path: "/", label: "Inicio" },
        { path: "/auth/login", label: "Login" },
      ];

  return (
    // Contenedor principal de la barra de navegación fijada arriba con estilo oscuro
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-neutral-800 bg-neutral-900/95 px-6 py-3 text-sm backdrop-blur-md">
      {/* Sección izquierda: Logotipo y enlaces de navegación */}
      <div className="flex items-center gap-6">
        {/* Logotipo de la aplicación con enlace a inicio */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-lg font-extrabold tracking-wide text-yellow-500">CineApp</span>
        </Link>

        {/* Lista de enlaces dinámica según el estado de autenticación */}
        <ul className="flex gap-2">
          {navLinks.map((link) => {
            // Verificamos si la ruta actual coincide con el enlace para resaltarlo
            const isActive = location.pathname === link.path;
            return (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    isActive
                      ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
                      : "text-neutral-300 hover:bg-neutral-800 hover:text-yellow-400"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Sección derecha: Perfil y botón de Cerrar Sesión (solo visible cuando hay un usuario activo) */}
      {user && (
        <div className="flex items-center gap-3">
          {/* Saludo con el nombre del usuario conectado */}
          <span className="hidden text-xs text-neutral-400 sm:inline">
            Hola, <strong className="text-neutral-200">{user.name}</strong>
          </span>
          {/* Botón interactivo para finalizar la sesión del usuario */}
          <button
            onClick={logout}
            className="rounded-lg border border-neutral-700 bg-neutral-800/80 px-3 py-1 text-xs font-semibold text-neutral-300 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 cursor-pointer"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  );
};