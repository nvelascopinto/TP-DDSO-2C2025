import NotificacionService from "../services/notificacionService.js"
import { notificacionValidator } from "../validators/notificacionValidator.js"
import { idValidator } from "../validators/idValidator.js"

class notificacionController {
  constructor(notificacionService) {
    this.notificacionService = notificacionService
  }

  marcarComoLeida(req, res) {
    const idNotificacion = idValidator.parse(req.params.id)

    return this.notificacionService.getNotificacion(idNotificacion)
    .then((notificacion) => {
      const usuario = req.usuario //chequear segun como lo pase middleware
      notificacionValidator(usuario, notificacion) //corregir esto debe ir en el service la logica
      notificacion.marcarComoLeida()
      res.status(200).json(notificacion)
    })
  } 

  getLeidas(req, res) {
    const idUsuario = req.params.idUsuario

    return this.notificacionService.getNotificacionesLeidas(idUsuario)
      .then((notificacionesLeidas) => {
        res.status(200).json(notificacionesLeidas)
      })
  }

  getNoLeidas(req, res) {
    const idUsuario = req.params.idUsuario
    return this.notificacionService.getNotificacionesNoLeidas(idUsuario)
      .then((notificacionesNoLeidas) => {
        res.status(200).json(notificacionesNoLeidas)
      })
  }
}

export default new notificacionController(NotificacionService)
