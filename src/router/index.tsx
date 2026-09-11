// router/index.tsx — Configuracion de rutas y arquitectura de navegacion de CineApp
// Como desarrollador junior, implementamos la proteccion de rutas con ProtectedRoute y visibilidad condicional

import { AnimatePresence, motion } from "framer-motion";
import { createBrowserRouter, Link, Navigate, Outlet, useLocation } from "react-router";
// Importamos todas las paginas de la aplicacion
import { LoginPage } from "@/features/auth/pages/login/LoginPage";
import { RegisterPage } from "@/features/auth/pages/register/RegisterPage";
import { HomePage } from "@/features/auth/pages/Home/HomePage";
import { MovieDescriptionPage } from "@/features/auth/pages/MoviewDescripcion/MovieDescriptionPage";
import { SeatSelectionPage } from "@/features/seatSelection/SeatSelectionPage";
import { MyTicketsPage } from "@/features/tickets/MyTicketsPage";
import { CartPage } from "@/features/cart/CartPage";
import { FloatingCart } from "@/features/cart/CartContext";
// Importamos la pagina de dulceria/confiteria
import { ConfectioneryPage } from "@/features/concessions/ConfectioneryPage";
import { Navbar } from "@/shared/components";
// Importamos el hook useAuth para acceder al usuario en sesion
import { useAuth } from "@/shared/context/AuthContext";
// Importamos el ErrorBoundary para capturar crasheos de render y mostrar pantalla amigable
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";

// Componente de Proteccion de Rutas Privadas
// Protege las rutas que requieren inicio de sesion obligatorio
const ProtectedRoute = ({ children, notice = false }: { children: React.ReactNode; notice?: boolean }) => {
  // Obtenemos el usuario autenticado desde el contexto global
  const { user } = useAuth();
  // Obtenemos la ubicacion actual para recordar a donde queria entrar el usuario
  const location = useLocation();

  // Si el usuario no tiene una sesion activa iniciada
  if (!user) {
    // Si la pantalla solicita un aviso explicativo antes de redirigir
    if (notice) {
      return (
        <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
          <h1 className="text-2xl font-bold text-neutral-100">Inicia sesion para ver tu carrito</h1>
          <p className="mt-3 text-sm text-neutral-400">Necesitas una cuenta activa para consultar y administrar tus tickets.</p>
          <Link
            to="/auth/login"
            state={{ from: location.pathname }}
            className="mt-6 rounded-xl bg-yellow-500 px-5 py-3 text-sm font-bold text-neutral-950 transition hover:bg-yellow-400"
          >
            Iniciar sesion
          </Link>
        </div>
      );
    }

    // Redirigimos automaticamente al Login guardando la ruta previa en el estado para retornar tras autenticarse
    return <Navigate to="/auth/login" replace state={{ from: location.pathname }} />;
  }

  // Si el usuario esta autenticado, permitimos el acceso renderizando el componente hijo
  return <>{children}</>;
};

// Componente para Rutas de Autenticacion (Login y Registro)
// Evita que un usuario que ya tiene sesion activa vuelva a ver los formularios de login o registro
const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  // Consultamos si el usuario ya esta autenticado
  const { user } = useAuth();

  // Si ya inicio sesion, lo redirigimos automaticamente a la cartelera de peliculas
  if (user) {
    return <Navigate to="/home" replace />;
  }

  // Si no esta logueado, le permitimos acceder a login o registro
  return <>{children}</>;
};

// Capa contenedora principal (Layout)
const PageShell = () => {
  const location = useLocation();
  // Consultamos el usuario para renderizar el carrito flotante unicamente si esta autenticado
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Barra de navegacion superior */}
      <Navbar />
      {/* El carrito flotante solo se muestra si el usuario ha iniciado sesion */}
      {user && <FloatingCart />}
      {/* Contenedor animado de transiciones entre rutas */}
      {/* No usamos mode="wait" en AnimatePresence porque causaria un flash negro entre rutas:
          con "wait" la pagina anterior desaparece completamente antes de que aparezca la nueva */}
      <AnimatePresence>
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="w-full"
        >
          {/* ErrorBoundary envuelve el contenido para capturar crasheos de render
              y mostrar una pantalla amigable en lugar de un fondo negro vacio */}
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </motion.main>
      </AnimatePresence>
    </div>
  );
};

// Definicion del Enrutador Principal
export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <PageShell />,
    children: [
      // Ruta publica de Inicio: se deja vacia tal como estaba originalmente
      {
        index: true,
        element: (
          <main className="p-10">
            <h1 className="text-2xl font-bold">Inicio</h1>
          </main>
        ),
      },
      // Ruta protegida de Cartelera: requiere login
      {
        path: "home",
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      // Ruta protegida de Detalles de Película: requiere login
      {
        path: "movies/:movieId",
        element: (
          <ProtectedRoute>
            <MovieDescriptionPage />
          </ProtectedRoute>
        ),
      },
      // Ruta protegida de Selección de Asientos y Stepper de Pago: requiere login
      {
        path: "movies/:movieId/seats",
        element: (
          <ProtectedRoute>
            <SeatSelectionPage />
          </ProtectedRoute>
        ),
      },
      // Ruta protegida de Mis Boletos: requiere login
      {
        path: "tickets",
        element: (
          <ProtectedRoute>
            <MyTicketsPage />
          </ProtectedRoute>
        ),
      },
      // Ruta protegida de Carrito de Compras: requiere login
      {
        path: "cart",
        element: (
          <ProtectedRoute notice>
            <CartPage />
          </ProtectedRoute>
        ),
      },
      // Ruta protegida de Confitería / Dulcería: requiere login
      {
        path: "concessions",
        element: (
          <ProtectedRoute>
            <ConfectioneryPage />
          </ProtectedRoute>
        ),
      },
      // Rutas de autenticación (Login y Registro): solo accesibles para usuarios sin sesión
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
      // Redirección de comodín ante cualquier ruta no coincidente
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);