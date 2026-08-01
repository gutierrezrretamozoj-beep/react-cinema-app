import type { CredencialesLogin, RespuestaLogin, Usuario } from "../interfaces";

/**
 * Por ahora no hay backend ni librería de estado (Zustand/Context) instalada,
 * así que esta carpeta solo expone funciones simples.
 * Cuando el backend esté listo, iniciarSesion() se reemplaza por un fetch real
 * y esta carpeta puede evolucionar a un store de verdad sin tocar la UI,
 * porque la firma (recibe credenciales, devuelve RespuestaLogin) no cambia.
 */
const USUARIOS_MOCK: Array<Usuario & { contraseña: string }> = [
  { id: "1", nombre: "Milton Escamilla", correo: "milton@cine.com", contraseña: "123456" },
  { id: "2", nombre: "Admin", correo: "admin@cine.com", contraseña: "admin123" },
];

const RETARDO_SIMULADO_MS = 800;

export function iniciarSesion(credenciales: CredencialesLogin): Promise<RespuestaLogin> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const usuarioEncontrado = USUARIOS_MOCK.find(
        (u) => u.correo.toLowerCase() === credenciales.correo.toLowerCase()
      );

      if (!usuarioEncontrado) {
        resolve({ exito: false, mensaje: "No existe una cuenta con ese correo." });
        return;
      }

      if (usuarioEncontrado.contraseña !== credenciales.contraseña) {
        resolve({ exito: false, mensaje: "La contraseña es incorrecta." });
        return;
      }

      const { contraseña, ...usuarioSinContraseña } = usuarioEncontrado;

      localStorage.setItem("token_cine", `token-${usuarioEncontrado.id}`);
      localStorage.setItem("usuario_cine", JSON.stringify(usuarioSinContraseña));

      resolve({ exito: true, usuario: usuarioSinContraseña });
    }, RETARDO_SIMULADO_MS);
  });
}

export function cerrarSesion(): void {
  localStorage.removeItem("token_cine");
  localStorage.removeItem("usuario_cine");
}

export function obtenerUsuarioActual(): Usuario | null {
  const usuarioGuardado = localStorage.getItem("usuario_cine");
  return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
}

export function haySesionActiva(): boolean {
  return localStorage.getItem("token_cine") !== null;
}