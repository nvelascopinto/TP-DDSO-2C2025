import { Router } from "express"
import UsuarioController from "../controllers/usuarioController.js"

const usuarioRouter = Router()

usuarioRouter.post("/", (req, res) => {
  UsuarioController.crearUsuario(req, res)
})

usuarioRouter.get("/:id", (req, res) => {
  UsuarioController.verUsuario(req, res)
})

usuarioRouter.get("/:id/pedidos", (req, res) => {
  UsuarioController.verHistorialUsuario(req, res)
})

export default usuarioRouter
