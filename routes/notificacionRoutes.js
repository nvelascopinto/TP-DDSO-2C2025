import { Router } from "express"
import NotificacionController from "../controllers/notificacionController.js"

const notificacionRouter = Router()

notificacionRouter.patch("/:id", (req, res, next) => {
   notificacionController.marcarComoLeida(req, res)
})

notificacionRouter.get("/:idusuario/leidas", (req, res, next) => {
   notificacionController.getLeidas(req, res)
})

notificacionRouter.get("/:idusuario/noleidas", (req, res, next) => {    
    notificacionController.getNoLeidas(req, res)   
})

export default notificacionRouter