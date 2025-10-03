import NotificacionService from "../services/notificacionService.js"
import notificacionValidator from "../validators/notificacionValidator.js"

class notificacionController {
  constructor(notificacionService) {
    this.notificacionService = notificacionService
  }

  marcarComoLeida(req, res){
    const idNotificacion = idValidator.parse(req.params.id)
    const notificacion = this.notificacionService.getNotificacion(idNotificacion)
    const usuario = req.usuario //chequear segun como lo pase middleware
    
    notificacionValidator(usuario, notificacion)
    notificacion.marcarComoLeida()
    return res.status(200).json(notificacion)
    
  }

  getLeidas(req, res){
    const idUsuario = req.params.idUsuario
    const notificacionesLeidas = this.notificacionService.getNotificacionesLeidas(idUsuario)
    return res.json(notificacionesLeidas)
  }

  getNoLeidas(req, res){
    const idUsuario = req.params.idUsuario
    const notificacionesNoLeidas = this.notificacionService.getNotificacionesNoLeidas(idUsuario)
    return res.json(notificacionesNoLeidas)
}
}

export default new notificacionController(NotificacionService)
