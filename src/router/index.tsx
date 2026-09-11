import { AnimatePresence, motion } from "framer-motion";
import { createBrowserRouter, Navigate, Outlet, useLocation } from "react-router";
import { LoginPage } from "@/features/auth/pages/login/LoginPage";
import { RegisterPage } from "@/features/auth/pages/register/RegisterPage";
import { HomePage } from "@/features/home/pages/HomePage";
import { CarteleraPage } from "@/features/movies/pages/CarteleraPage";
import { ComingSoonPage } from "@/features/movies/pages/ComingSoonPage";
import { MovieDescriptionPage } from "@/features/auth/pages/MoviewDescripcion/MovieDescriptionPage";
import { SeatSelectionPage } from "@/features/seatSelection/SeatSelectionPage";
import { MyTicketsPage } from "@/features/tickets/MyTicketsPage";
import { Navbar } from "@/shared/components";

const PageShell = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={`w-full ${isHome ? "" : "pt-16"}`}
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
        element: <HomePage />,
      },
      // Cartelera general en /movies según lo acordado
      { path: "movies", element: <CarteleraPage /> },
      // Próximos estrenos
      { path: "coming-movies", element: <ComingSoonPage /> },
      // Redirección y compatibilidad con enlaces anteriores
      { path: "home", element: <Navigate to="/movies" replace /> },
      { path: "cartelera", element: <Navigate to="/movies" replace /> },
      // Detalle y compra
      { path: "movies/:movieId", element: <MovieDescriptionPage /> },
      { path: "movies/:movieId/seats", element: <SeatSelectionPage /> },
      { path: "tickets", element: <MyTicketsPage /> },
      // Autenticación
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