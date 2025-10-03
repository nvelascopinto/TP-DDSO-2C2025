import { Router } from "express"
import NotificacionController from "../controllers/notificacionController.js"

const notificacionRouter = Router()

notificacionRouter.patch("/:id", (req, res) => {
  NotificacionController.marcarComoLeida(req, res)
})

notificacionRouter.get("/:idusuario/leidas", (req, res) => {
  NotificacionController.getLeidas(req, res)
})

notificacionRouter.get("/:idusuario/noleidas", (req, res) => {
  NotificacionController.getNoLeidas(req, res)
})

export default notificacionRouter
