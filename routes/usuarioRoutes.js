import { Router } from "express"
import UsuarioController from "../controllers/usuarioController.js"

const usuarioRouter = Router()

usuarioRouter.post("/", (req, res) => {
  return UsuarioController.crearUsuario(req, res)
})

usuarioRouter.get("/:id", (req, res) => {
  return UsuarioController.verUsuario(req, res)
})

usuarioRouter.get("/:id/pedidos", (req, res) => {
  return UsuarioController.verHistorialUsuario(req, res)
})

export default usuarioRouter
