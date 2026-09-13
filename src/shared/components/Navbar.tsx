import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Ticket, User } from "lucide-react";
import logoCine from "../../assets/icons/logo-cine.svg";
import nombreCine from "../../assets/icons/nombre-cine.svg";

interface NavLinkItem {
  path: string;
  label: string;
}

const NAV_LINKS: NavLinkItem[] = [
  { path: "/", label: "INICIO" },
  { path: "/movies", label: "CARTELERA" },
  { path: "/coming-movies", label: "PROXIMAMENTE" },
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
        
        {/* Logo / Nombre del Cine (Estilo Eclipse Cinema) */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={logoCine}
              alt="Dexus Logo"
              className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-[0_2px_8px_rgba(0,59,255,0.3)]"
            />
            <img
              src={nombreCine}
              alt="DEXUS FILMS"
              className="h-5.5 sm:h-6.5 w-auto object-contain transition-opacity group-hover:opacity-90"
            />
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
                  className={`relative px-3 py-2 text-[0.7rem] font-normal font-monument tracking-[0.16em]  transition-all ${
                    isActive
                      ? "text-white/90"
                      : "text-cinema-muted/80 hover:text-white"
                  }`}
                >
                  {link.label}

                  {/* Indicador de pestaña activa (Turquesa / Eclipse) */}
                  {isActive && (
                    <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-white shadow-sm shadow-cinema-turquoise/50" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Acciones de la derecha */}
        <div className="flex items-center gap-3">
          
          {/* Botón Mis Boletos */}
          <Link
            to="/tickets"
            className="flex items-center gap-2 rounded-xl border border-cinema-border bg-cinema-surface/60 px-3.5 py-2 text-xs font-semibold text-cinema-muted hover:border-cinema-turquoise/40 hover:text-cinema-turquoise transition-all backdrop-blur-xs"
            title="Mis Boletos y Reservas"
          >
            <Ticket className="h-4 w-4 text-cinema-turquoise" />
            <span className="hidden lg:inline">Mis Boletos</span>
          </Link>

          {/* Icono de Login / Perfil */}
          <Link
            to="/auth/login"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-cinema-border bg-cinema-surface/80 hover:border-cinema-electric hover:text-cinema-turquoise text-cinema-text transition-all shadow-sm hover:scale-105 active:scale-95"
            title="Iniciar Sesión / Mi Cuenta"
            aria-label="Iniciar Sesión"
          >
            <User className="h-4.5 w-4.5" />
          </Link>
        </div>

      </div>

      {/* Menú móvil */}
      <div className="md:hidden flex items-center justify-around border-t border-cinema-border/40 px-4 py-2 mt-2 bg-cinema-bg/70 backdrop-blur-md">
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
                isActive ? "text-white font-bold border-b-2 border-white" : "text-cinema-muted"
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