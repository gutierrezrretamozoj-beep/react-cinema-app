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

export interface DatosRegistro {
  nombre: string;
  correo: string;
  contraseña: string;
}

export interface RespuestaRegistro {
  exito: boolean;
  usuario?: Usuario;
  mensaje?: string;
}