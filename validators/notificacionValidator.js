import NotificacionInexistenteError from "../errors/notificacionInexistenteError.js"
import UsuarioSinPermisoError from "../errors/usuarioSinPermisoError.js"

export function notificacionValidator(usuario, notificacion) {
  const idDestinatario = notificacion.usuarioDestino
  const idUsuario = usuario.username
  if (idUsuario === idDestinatario) {
    return notificacion
  }
  throw new UsuarioSinPermisoError(idUsuario)
}

export function notificacionExisteValidator(notificacion, id) {
  if (notificacion == null) {
    throw new NotificacionInexistenteError(id)
  }
}