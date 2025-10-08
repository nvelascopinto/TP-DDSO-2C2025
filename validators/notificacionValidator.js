import UsuarioSinPermisoError from "../errors/usuarioSinPermisoError.js"

export function notificacionValidator(usuario, notificacion) {
  const idDestinatario = notificacion.usuarioDestino
  const idUsuario = usuario.username
  if (idUsuario === idDestinatario) {
    return notificacion
  }
  throw new UsuarioSinPermisoError(idUsuario)
}
