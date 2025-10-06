import { Router } from "express"
import NotificacionController from "../controllers/notificacionController.js"
import { authenticateUser } from "../middleware/authenticationHandler.js"
const notificacionRouter = Router()
// ver si debe ir el .catch(next)????????????????????????????
notificacionRouter.patch("/:id", authenticateUser('X-User'), (req, res) => {
  NotificacionController.marcarComoLeida(req, res)
})

notificacionRouter.get("/:idusuario/leidas", authenticateUser('X-User'),(req, res) => {
  return NotificacionController.getLeidas(req, res)
})

notificacionRouter.get("/:idusuario/noleidas",authenticateUser('X-User'), (req, res) => {
  return NotificacionController.getNoLeidas(req, res)
})

export default notificacionRouter
