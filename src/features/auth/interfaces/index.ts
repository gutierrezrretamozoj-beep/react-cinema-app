export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
}

export interface CredencialesLogin {
  correo: string;
  contraseña: string;
}

export interface RespuestaLogin {
  exito: boolean;
  usuario?: Usuario;
  mensaje?: string;
}