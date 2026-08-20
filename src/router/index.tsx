import { createBrowserRouter } from "react-router";
import { LoginPage } from "@/features/auth/pages/login/LoginPage";
import { RegisterPage } from "@/features/auth/pages/register/RegisterPage";
import { HomePage } from "@/features/auth/pages/Home/HomePage";
import { MovieDescriptionPage } from "@/features/auth/pages/MoviewDescripcion/MovieDescriptionPage";
import { PageShell } from "./PageShell";

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