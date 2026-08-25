import { createBrowserRouter } from "react-router";
import { LoginPage } from "@/features/auth/pages/login/LoginPage";
import { RegisterPage } from "@/features/auth/pages/register/RegisterPage";
import { HomePage } from "@/features/auth/pages/Home/HomePage";
import { MovieListingsPage } from "@/features/movies/components";
import { Navbar } from "@/shared/components";

const withNavbar = (element: React.ReactNode) => (
  <div className="min-h-screen bg-neutral-950 text-neutral-100">
    <Navbar />
    {element}
  </div>
);

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: withNavbar(
      <main className="p-10">
        <h1 className="text-2xl font-bold">Inicio</h1>
        <p className="mt-2 text-neutral-400">
          Navega con el menú superior entre Login, Registro y Cartelera.
        </p>
      </main>
    ),
  },
  {
    path: "/home",
    element: withNavbar(<HomePage />),
  },
  {
    // Nueva ruta: dashboard real con hook useMovieListings
    path: "/movies",
    element: withNavbar(<MovieListingsPage />),
  },
  {
    path: "/auth",
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },
]);