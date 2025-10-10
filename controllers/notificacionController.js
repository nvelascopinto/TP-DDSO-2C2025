import notificacionService from "../services/notificacionService.js"
import { idValidator } from "../validators/idValidator.js"

class notificacionController {
  marcarComoLeida(req, res) {
    return Promise.resolve()
      .then(() => {
        const idNotificacion = idValidator.parse(req.params.id)
        const usuario = req.user.username
        return notificacionService.marcarComoLeida(idNotificacion, usuario)
      })
      .then(() => {
        res.status(200).json("La notificacion fue leida")
      })
  }

  getLeidas(req, res) {
    return Promise.resolve()
      .then(() => {
        const idUsuario = req.user.username
        return notificacionService.getNotificacionesLeidas(idUsuario)
      })
      .then((notificacionesLeidas) => {
        res.status(200).json(notificacionesLeidas)
      })
  }

  getNoLeidas(req, res) {
    return Promise.resolve()
      .then(() => {
        const idUsuario = req.user.username
        return notificacionService.getNotificacionesNoLeidas(idUsuario)
      })
      .then((notificacionesNoLeidas) => {
        res.status(200).json(notificacionesNoLeidas)
      })
  }
}

export default new notificacionController()
