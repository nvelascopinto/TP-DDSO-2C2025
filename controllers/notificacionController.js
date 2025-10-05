import NotificacionService from "../services/notificacionService.js"
import { notificacionValidator } from "../validators/notificacionValidator.js"
import { idValidator } from "../validators/idValidator.js"

class notificacionController {

  marcarComoLeida(req, res) {
    const idNotificacion = idValidator.parse(req.params.id)
    const usuario = req.usuario // ver como lo trae el middleware
    return NotificacionService.marcarComoLeida(idNotificacion, usuario)
    .then(() => {
      res.status(200).json("La notificacion fue leida")
    })
  } 

  getLeidas(req, res) {
    const idUsuario = req.params.idUsuario

    return NotificacionService.getNotificacionesLeidas(idUsuario)
      .then((notificacionesLeidas) => {
        res.status(200).json(notificacionesLeidas)
      })
  }

  getNoLeidas(req, res) {
    const idUsuario = req.params.idUsuario
    return NotificacionService.getNotificacionesNoLeidas(idUsuario)
      .then((notificacionesNoLeidas) => {
        res.status(200).json(notificacionesNoLeidas)
      })
  }

  
}

export default new notificacionController(NotificacionService)
