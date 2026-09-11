import { AnimatePresence, motion } from "framer-motion";
import { createBrowserRouter, Link, Navigate, Outlet, useLocation } from "react-router";
import { LoginPage } from "@/features/auth/pages/login/LoginPage";
import { RegisterPage } from "@/features/auth/pages/register/RegisterPage";
import { HomePage } from "@/features/auth/pages/Home/HomePage";
import { MovieDescriptionPage } from "@/features/auth/pages/MoviewDescripcion/MovieDescriptionPage";
import { SeatSelectionPage } from "@/features/seatSelection/SeatSelectionPage";
import { MyTicketsPage } from "@/features/tickets/MyTicketsPage";
import { CartPage } from "@/features/cart/CartPage";
import { FloatingCart } from "@/features/cart/CartContext";
import { Navbar } from "@/shared/components";
import { useAuth } from "@/shared/context/AuthContext";

const ProtectedRoute = ({ children, notice = false }: { children: React.ReactNode; notice?: boolean }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    if (notice) {
      return (
        <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
          <h1 className="text-2xl font-bold text-neutral-100">Inicia sesión para ver tu carrito</h1>
          <p className="mt-3 text-sm text-neutral-400">Necesitas una cuenta activa para consultar y administrar tus tickets.</p>
          <Link to="/auth/login" state={{ from: location.pathname }} className="mt-6 rounded-xl bg-yellow-500 px-5 py-3 text-sm font-bold text-neutral-950 transition hover:bg-yellow-400">
            Iniciar sesión
          </Link>
        </div>
      );
    }

    return <Navigate to="/auth/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};

const PageShell = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar />
      <FloatingCart />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
    </div>
  );
};

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <PageShell />,
    children: [
      {
        index: true,
        element: (
          <main className="p-10">
            <h1 className="text-2xl font-bold">Inicio</h1>
            <p className="mt-2 text-neutral-400">Navega con el menú superior entre Login, Registro y Cartelera.</p>
          </main>
        ),
      },
      { path: "home", element: <HomePage /> },
      { path: "movies/:movieId", element: <MovieDescriptionPage /> },
      { path: "movies/:movieId/seats", element: <SeatSelectionPage /> },
      {
        path: "tickets",
        element: (
          <ProtectedRoute>
            <MyTicketsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "cart",
        element: (
          <ProtectedRoute notice>
            <CartPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "auth",
        children: [
          { path: "login", element: <LoginPage /> },
          { path: "register", element: <RegisterPage /> },
        ],
      },
    ],
  },
]);