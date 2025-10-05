import { Router } from "express"
import NotificacionController from "../controllers/notificacionController.js"

const notificacionRouter = Router()
// ver si debe ir el .catch(next)????????????????????????????
notificacionRouter.patch("/:id", (req, res) => {
  NotificacionController.marcarComoLeida(req, res)
})

notificacionRouter.get("/:idusuario/leidas", (req, res) => {
  return NotificacionController.getLeidas(req, res)
})

notificacionRouter.get("/:idusuario/noleidas", (req, res) => {
  return NotificacionController.getNoLeidas(req, res)
})

export default notificacionRouter
