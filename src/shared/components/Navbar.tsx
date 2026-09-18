import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Home, Film, CalendarClock, Tickets, User, Menu, X, LogOut, Popcorn, Tags } from "lucide-react";
import logoCine from "../../assets/icons/logo-cine.svg";
import nombreCine from "../../assets/icons/nombre-cine.svg";
import { useAuth } from "@/shared/context/AuthContext";

interface NavLinkItem {
  path: string;
  label: string;
  icon: typeof Home;
}

const NAV_LINKS: NavLinkItem[] = [
  { path: "/", label: "INICIO", icon: Home },
  { path: "/movies", label: "CARTELERA", icon: Film },
  { path: "/coming-movies", label: "PROXIMAMENTE", icon: CalendarClock },
  { path: "/concessions", label: "DULCERIA", icon: Popcorn },
  { path: "/promotions", label: "PROMOCIONES", icon: Tags },
];

export const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const hasHero = location.pathname === "/" || location.pathname === "/movies";
  const isTicketsActive = location.pathname.startsWith("/tickets");
  const isLoginActive = location.pathname.startsWith("/auth");

  // Escuchar el scroll de la ventana
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

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isTransparent = hasHero && !isScrolled && !isMobileMenuOpen;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent border-b border-transparent py-4"
          : "bg-neutral-950/85 backdrop-blur-md border-b border-neutral-800/80 shadow-2xl py-3"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 flex items-center justify-between xl:max-w-[95%]">
        
        {/* Logo / Nombre del Cine (Estilo Eclipse Cinema) */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={logoCine}
              alt="Dexus Logo"
              className="hidden sm:block h-7 w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-[0_2px_8px_rgba(0,59,255,0.3)]"
            />
            <img
              src={nombreCine}
              alt="DEXUS FILMS"
              className="h-5.5 sm:h-6.5 w-auto object-contain transition-opacity group-hover:opacity-90"
            />
          </Link>

          {/* Menú de Navegación Desktop: Texto limpio y tipografía de cine */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(link.path);

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-3.5 py-2 text-[0.7rem] font-normal font-monument tracking-[0.16em] transition-all ${
                    isActive
                      ? "text-white"
                      : "text-cinema-muted/80 hover:text-white"
                  }`}
                >
                  {link.label}

                  {/* Indicador de pestaña activa (Turquesa / Eclipse) */}
                  {isActive && (
                    <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-cinema-turquoise shadow-[0_0_8px_rgba(0,210,255,0.8)]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Acciones de la derecha en Desktop */}
        <div className="hidden md:flex items-center gap-2.5 sm:gap-3">
          {/* Botón Mis Boletos */}
          <Link
            to="/tickets"
            className={`group relative flex items-center gap-2 rounded-full border px-3.5 py-1.5 transition-all duration-300 backdrop-blur-md ${
              isTicketsActive
                ? "border-cinema-text/60 bg-cinema-turquoise/15 text-white shadow-[0_0_15px_rgba(0,210,255,0.3)]"
                : "border-white/12 bg-white/4 text-cinema-text/80 hover:border-cinema-turquoise/40 hover:bg-white/8 hover:text-cinema-text hover:shadow-[0_0_15px_rgba(0,210,255,0.18)]"
            }`}
            title="Mis Boletos y Reservas"
          >
            <Tickets className="h-4.5 w-4.5 transition-transform duration-300 group-hover:rotate-[-15deg] group-hover:scale-110 text-cinema-text" />
          </Link>

          {/* Autenticación / Perfil */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-[0.75rem] text-neutral-300 font-sans hidden lg:inline">
                Hola, <strong className="text-white">{user.name}</strong>
              </span>
              <button
                onClick={logout}
                title="Cerrar sesión"
                className="flex h-8.5 w-8.5 items-center justify-center rounded-full border border-white/12 bg-white/4 hover:border-red-500/40 hover:bg-red-500/10 text-neutral-400 hover:text-red-400 transition-all backdrop-blur-md cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <Link
              to="/auth/login"
              className={`flex h-8.5 w-8.5 items-center justify-center rounded-full border transition-all duration-300 backdrop-blur-md shadow-sm hover:scale-105 active:scale-95 ${
                isLoginActive
                  ? "border-cinema-text/60 bg-cinema-electric/20 text-cinema-text shadow-[0_0_12px_rgba(0,210,255,0.3)]"
                  : "border-white/12 bg-white/4 hover:border-cinema-turquoise/40 hover:bg-white/8 text-cinema-text/80 hover:text-cinema-text"
              }`}
              title="Iniciar Sesión / Mi Cuenta"
              aria-label="Iniciar Sesión"
            >
              <User className="h-4 w-4" />
            </Link>
          )}
        </div>

        {/* Botón Hamburguesa en Móvil */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/4 text-white/80 hover:text-white hover:border-cinema-turquoise/40 hover:bg-white/8 transition-all backdrop-blur-md"
            aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>
        </div>

      </div>

      {/* Menú Desplegable Móvil (Drawer) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden border-t border-white/10 bg-neutral-950/95 backdrop-blur-2xl shadow-2xl"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {/* Enlaces principales */}
              {NAV_LINKS.map((link) => {
                const Icon = link.icon;
                const isActive =
                  link.path === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(link.path);

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-sans font-black tracking-[0.14em] transition-all ${
                      isActive
                        ? "bg-cinema-primary/15 text-blue-500 border border-cinema-turquoise/30"
                        : "text-cinema-muted/90 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {/* Separador sutil */}
              <div className="my-2 h-px w-full bg-white/10" />

              {/* Mis Boletos */}
              <Link
                to="/tickets"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-sans font-black tracking-[0.14em] transition-all ${
                  isTicketsActive
                    ? "bg-cinema-turquoise/15 text-blue-500 border border-cinema-turquoise/30 font-bold"
                    : "text-cinema-muted/90 hover:text-white hover:bg-white/5"
                }`}
              >
                <Tickets className="h-4 w-4 shrink-0" />
                <span>MIS BOLETOS</span>
              </Link>

              {/* Perfil / Iniciar Sesión / Cerrar Sesión */}
              {user ? (
                <>
                  <div className="flex items-center gap-4 px-3.5 py-2.5 text-xs text-neutral-300">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 shrink-0" />
                      <span className="font-sans font-black text-[0.7rem] text-cinema-muted">USUARIO</span>
                    </div>
                    <span className="font-sans font-black text-white truncate max-w-40">{user.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-sans font-black tracking-[0.14em] text-red-400 hover:bg-red-500/10 transition-all text-left w-full cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 shrink-0" />
                    <span>CERRAR SESIÓN</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-monument tracking-[0.14em] transition-all ${
                    isLoginActive
                      ? "bg-cinema-electric/15 text-cinema-electric border border-cinema-electric/30 font-bold"
                      : "text-cinema-muted/90 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <User className="h-4 w-4 shrink-0" />
                  <span>PERFIL</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};