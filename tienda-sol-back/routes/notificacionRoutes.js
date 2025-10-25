import { Router } from "express"
import notificacionController from "../controllers/notificacionController.js"
import { authenticateUser } from "../middleware/authenticationHandler.js"
const notificacionRouter = Router()
// ver si debe ir el .catch(next)????????????????????????????
notificacionRouter.patch("/:id", authenticateUser("X-User"), (req, res) => {
  return notificacionController.marcarComoLeida(req, res)
})

notificacionRouter.get("/leidas", authenticateUser("X-User"), (req, res) => {
  return notificacionController.getLeidas(req, res)
})

notificacionRouter.get("/noleidas", authenticateUser("X-User"), (req, res) => {
  return notificacionController.getNoLeidas(req, res)
})

export default notificacionRouter
