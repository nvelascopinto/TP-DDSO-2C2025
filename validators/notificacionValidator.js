import UsuarioSinPermisoError from "../errors/usuarioSinPermisoError.js"

export function notificacionValidator(usuario, notificacion) {
  const destinatario = notificacion.destinatario()
  const idDestinatario = destinatario._id
  const idUsuario = usuario._id
  if (idUsuario === idDestinatario) {
    return notificacion
  }
  throw new UsuarioSinPermisoError(idUsuario)
}
