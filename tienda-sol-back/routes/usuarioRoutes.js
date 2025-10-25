import { Router } from "express"
import usuarioController from "../controllers/usuarioController.js"
import { authenticateUser } from "../middleware/authenticationHandler.js"
const usuarioRouter = Router()

usuarioRouter.post("/", (req, res) => {
  return usuarioController.crearUsuario(req, res)
})

usuarioRouter.get("/:id", (req, res) => {
  return usuarioController.verUsuario(req, res)
})

usuarioRouter.get("/:id/pedidos", authenticateUser("X-User"), (req, res) => {
  return usuarioController.verHistorialUsuario(req, res)
})

export default usuarioRouter
