// router/index.tsx — Configuracion de rutas y arquitectura de navegacion de CineApp
import { AnimatePresence, motion } from "framer-motion";
import { createBrowserRouter, Link, Navigate, Outlet, useLocation } from "react-router";
// Importamos todas las paginas de la aplicacion
import { LoginPage } from "@/features/auth/pages/login/LoginPage";
import { RegisterPage } from "@/features/auth/pages/register/RegisterPage";
import { HomePage } from "@/features/home/pages/HomePage";
import { CarteleraPage } from "@/features/movies/pages/CarteleraPage";
import { ComingSoonPage } from "@/features/movies/pages/ComingSoonPage";
import { MovieDescriptionPage } from "@/features/auth/pages/MoviewDescripcion/MovieDescriptionPage";
import { SeatSelectionPage } from "@/features/seatSelection/SeatSelectionPage";
import { MyTicketsPage } from "@/features/tickets/MyTicketsPage";
import { CartPage } from "@/features/cart/CartPage";
import { FloatingCart } from "@/features/cart/CartContext";
import { ConfectioneryPage } from "@/features/concessions/ConfectioneryPage";
import { Navbar } from "@/shared/components";
import { useAuth } from "@/shared/context/AuthContext";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";

// Componente de Proteccion de Rutas Privadas
// Protege las rutas que requieren inicio de sesion obligatorio
const ProtectedRoute = ({ children, notice = false }: { children: React.ReactNode; notice?: boolean }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    if (notice) {
      return (
        <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
          <h1 className="text-2xl font-bold text-neutral-100">Inicia sesión para ver tu carrito</h1>
          <p className="mt-3 text-sm text-neutral-400">Necesitas una cuenta activa para consultar y administrar tus tickets.</p>
          <Link
            to="/auth/login"
            state={{ from: location.pathname }}
            className="mt-6 rounded-xl bg-cinema-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-cinema-primary-hover shadow-lg"
          >
            Iniciar sesión
          </Link>
        </div>
      );
    }

    return <Navigate to="/auth/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};

// Componente para Rutas de Autenticacion (Login y Registro)
// Evita que un usuario que ya tiene sesion activa vuelva a ver los formularios de login o registro
const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Capa contenedora principal (Layout)
const PageShell = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen bg-transparent text-cinema-text">
      {/* Barra de navegación superior */}
      <Navbar />
      {/* El carrito flotante solo se muestra si el usuario ha iniciado sesión */}
      {user && <FloatingCart />}
      {/* Contenedor animado de transiciones entre rutas */}
      <AnimatePresence>
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`w-full ${isHome ? "" : "pt-16"}`}
        >
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </motion.main>
      </AnimatePresence>
    </div>
  );
};

// Definición del Enrutador Principal
export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <PageShell />,
    children: [
      // Inicio (Hero Carousel + Secciones en Cartelera y Próximamente)
      {
        index: true,
        element: <HomePage />,
      },
      // Cartelera general
      { path: "movies", element: <CarteleraPage /> },
      // Próximos estrenos
      { path: "coming-movies", element: <ComingSoonPage /> },
      // Redirecciones y compatibilidad de rutas
      { path: "home", element: <Navigate to="/movies" replace /> },
      { path: "cartelera", element: <Navigate to="/movies" replace /> },
      // Detalle de Película
      { path: "movies/:movieId", element: <MovieDescriptionPage /> },
      // Selección de Asientos y Stepper de Pago (Ruta protegida)
      {
        path: "movies/:movieId/seats",
        element: (
          <ProtectedRoute>
            <SeatSelectionPage />
          </ProtectedRoute>
        ),
      },
      // Mis Boletos (Ruta protegida)
      {
        path: "tickets",
        element: (
          <ProtectedRoute>
            <MyTicketsPage />
          </ProtectedRoute>
        ),
      },
      // Carrito de Compras (Ruta protegida con aviso amigable)
      {
        path: "cart",
        element: (
          <ProtectedRoute notice>
            <CartPage />
          </ProtectedRoute>
        ),
      },
      // Confitería / Dulcería (Ruta protegida)
      {
        path: "concessions",
        element: (
          <ProtectedRoute>
            <ConfectioneryPage />
          </ProtectedRoute>
        ),
      },
      // Rutas de autenticación (Login y Registro)
      {
        path: "auth",
        children: [
          {
            path: "login",
            element: (
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            ),
          },
          {
            path: "register",
            element: (
              <PublicOnlyRoute>
                <RegisterPage />
              </PublicOnlyRoute>
            ),
          },
        ],
      },
      // Redirección ante cualquier ruta no coincidente
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);