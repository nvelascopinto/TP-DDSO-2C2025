import notificacionService from "../services/notificacionService.js"
import { idMongoValidator } from "../validators/idValidator.js"
import { ZodValidationError } from "../errors/validationError.js"

class notificacionController {
  marcarComoLeida(req, res) {
    return Promise.resolve()
      .then(() =>
        idMongoValidator.parse(req.params.id)
      ) 
      .catch((e) => {
        throw new ZodValidationError(e)
      })
      .then((idNotificacion) =>
        notificacionService.marcarComoLeida(idNotificacion, req.user.username)
      )
      .then(() =>
        res.status(200).json("La notificacion fue leida")
      )
  }

  getLeidas(req, res) {
    return Promise.resolve()
      .then(() => 
        notificacionService.getNotificacionesLeidas(req.user.username)
      )
      .then((notificacionesLeidas) =>
        res.status(200).json(notificacionesLeidas)
      )
  }

  getNoLeidas(req, res) {
    return Promise.resolve()
      .then(() => 
        notificacionService.getNotificacionesNoLeidas(req.user.username)
      )
      .then((notificacionesNoLeidas) =>
        res.status(200).json(notificacionesNoLeidas)
      )
  }

    getNotificaciones(req, res) {
    return Promise.resolve()
      .then(() => 
        notificacionService.getNotificaciones(req.user.username)
      )
      .then((notificaciones) =>
        res.status(200).json(notificaciones)
      )
  }
}

export default new notificacionController()
