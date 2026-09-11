import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Clapperboard, Ticket, User } from "lucide-react";

interface NavLinkItem {
  path: string;
  label: string;
}

const NAV_LINKS: NavLinkItem[] = [
  { path: "/", label: "Inicio" },
  { path: "/movies", label: "Cartelera" },
  { path: "/coming-movies", label: "Próximamente" },
];

export const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  const isHome = location.pathname === "/";

  // Efecto para escuchar el scroll de la ventana
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // En Home empieza transparente si no hay scroll, en otras rutas mantiene fondo oscuro elegante
  const isTransparent = isHome && !isScrolled;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent border-b border-transparent py-4"
          : "bg-neutral-950/85 backdrop-blur-md border-b border-neutral-800/80 shadow-2xl py-3"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo / Nombre del Cine (Izquierda) */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-500/15 border border-yellow-500/30 text-yellow-500 transition-transform group-hover:scale-105">
              <Clapperboard className="h-5 w-5" />
            </div>
            <span className="text-xl font-black tracking-wide bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500 bg-clip-text text-transparent font-serif">
              CineApp
            </span>
          </Link>

          {/* Menú de Navegación Central */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(link.path);

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-3.5 py-2 text-sm font-semibold tracking-wide transition-all ${
                    isActive
                      ? "text-yellow-400 font-bold"
                      : "text-neutral-300 hover:text-white"
                  }`}
                >
                  {link.label}

                  {/* Indicador de pestaña activa (subrayado dorado idéntico al boceto) */}
                  {isActive && (
                    <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-yellow-400 shadow-sm shadow-yellow-400/50" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Acciones de la derecha: Mis Boletos y Login/Icono de Usuario */}
        <div className="flex items-center gap-3">
          
          {/* Botón Mis Boletos */}
          <Link
            to="/tickets"
            className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/60 px-3.5 py-2 text-xs font-semibold text-neutral-300 hover:border-yellow-500/40 hover:text-yellow-400 transition-all backdrop-blur-xs"
            title="Mis Boletos y Reservas"
          >
            <Ticket className="h-4 w-4 text-yellow-500" />
            <span className="hidden sm:inline">Mis Boletos</span>
          </Link>

          {/* Icono de Login / Perfil */}
          <Link
            to="/auth/login"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-700 bg-neutral-900/80 hover:border-yellow-500 hover:text-yellow-400 text-neutral-200 transition-all shadow-sm hover:scale-105 active:scale-95"
            title="Iniciar Sesión / Mi Cuenta"
            aria-label="Iniciar Sesión"
          >
            <User className="h-4.5 w-4.5" />
          </Link>
        </div>

      </div>

      {/* Menú móvil inferior si la pantalla es reducida */}
      <div className="md:hidden flex items-center justify-around border-t border-neutral-800/40 px-4 py-2 mt-2 bg-neutral-950/60 backdrop-blur-md">
        {NAV_LINKS.map((link) => {
          const isActive =
            link.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(link.path);

          return (
            <Link
              key={link.path}
              to={link.path}
              className={`text-xs font-semibold py-1 px-2 ${
                isActive ? "text-yellow-400 font-bold border-b-2 border-yellow-400" : "text-neutral-400"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
};