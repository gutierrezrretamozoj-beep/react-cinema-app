import { Link } from "react-router";

const LINKS = [
  { path: "/", label: "Inicio" },
  { path: "/home", label: "Cartelera" },
  { path: "/auth/login", label: "Login" },
  { path: "/auth/register", label: "Registro" },
  { path: "/cart", label: "Carrito" },
];

export const Navbar = () => {
  return (
    <nav className="flex items-center gap-6 border-b border-neutral-800 bg-neutral-900 px-6 py-3 text-sm">
      <span className="text-lg font-extrabold tracking-wide text-yellow-500">CineApp</span>
      <ul className="flex gap-4">
        {LINKS.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className="rounded-md px-3 py-1.5 text-neutral-300 transition hover:bg-neutral-800 hover:text-yellow-400"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};