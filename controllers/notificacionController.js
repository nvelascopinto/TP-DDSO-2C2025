import {notificacionServiceInstance} from "../services/notificacionService.js"
import { idValidator } from "../validators/idValidator.js"

class notificacionController {
  marcarComoLeida(req, res) {
    return Promise.resolve()
      .then(() => {
        const idNotificacion = idValidator.parse(req.params.id)
        const usuario = req.user.username
        return notificacionServiceInstance.marcarComoLeida(idNotificacion, usuario)
      })
      .then(() => {
        res.status(200).json("La notificacion fue leida")
      })
  }

  getLeidas(req, res) {
    return Promise.resolve()
      .then(() => {
        const idUsuario = req.user.username
        return notificacionServiceInstance.getNotificacionesLeidas(idUsuario)
      })
      .then((notificacionesLeidas) => {
        res.status(200).json(notificacionesLeidas)
      })
  }

  getNoLeidas(req, res) {
    return Promise.resolve()
      .then(() => {
        const idUsuario = req.user.username
        return notificacionServiceInstance.getNotificacionesNoLeidas(idUsuario)
      })
      .then((notificacionesNoLeidas) => {
        res.status(200).json(notificacionesNoLeidas)
      })
  }
}

export default new notificacionController(notificacionServiceInstance)
