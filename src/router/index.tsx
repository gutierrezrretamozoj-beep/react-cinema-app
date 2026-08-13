import { AnimatePresence, motion } from "framer-motion";
import { createBrowserRouter, Outlet, useLocation } from "react-router";
import { LoginPage } from "@/features/auth/pages/login/LoginPage";
import { RegisterPage } from "@/features/auth/pages/register/RegisterPage";
import { HomePage } from "@/features/auth/pages/Home/HomePage";
import { MovieDescriptionPage } from "@/features/auth/pages/MoviewDescripcion/MovieDescriptionPage";
import { Navbar } from "@/shared/components";

const PageShell = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar />
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