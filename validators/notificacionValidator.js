
export function notificacionValidator(usuario, notificacion){
    const destinatario = notificacion.destinatario()
    const idDestinatario = destinatario.id()
    const idUsuario = usuario.id()
    if(idUsuario === idDestinatario){
        return notificacion
    }
    return throw new UsuarioSinPermisoError(idUsuario)
}