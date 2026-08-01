import { createBrowserRouter } from "react-router";
import { LoginPage } from "./features/auth/pages/login/LoginPage";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello World</div>,
  },
  {
    path: "/auth",
    children: [
      { path: "login", element: <LoginPage /> },
    ],
  },
]);