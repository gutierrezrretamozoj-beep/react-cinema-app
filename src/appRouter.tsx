import { createBrowserRouter } from "react-router";
import { LoginPage } from "./features/auth/pages/login/LoginPage";
import { RegisterPage } from "./features/auth/pages/register/RegisterPage";
import { Navbar } from "./shared/components";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="min-h-screen bg-neutral-950 text-neutral-100">
        <Navbar />
        <main className="p-10">
          <h1 className="text-2xl font-bold">Inicio</h1>
          <p className="mt-2 text-neutral-400">
            Navega con el menú superior entre Login y Registro.
          </p>
        </main>
      </div>
    ),
  },
  {
    path: "/auth",
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },
]);