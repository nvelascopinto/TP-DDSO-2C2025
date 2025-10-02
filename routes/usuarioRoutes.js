import { Router } from "express"
import UsuarioController from "../controllers/usuarioController.js"

const usuarioRouter = Router()

usuarioRouter.post("/", (req, res, next) => {
  UsuarioController.crearUsuario(req, res)
})

usuarioRouter.get("/:id", (req, res, next) => {
  UsuarioController.verUsuario(req, res)
})

usuarioRouter.get("/:id/pedidos", (req, res, next) => {
  UsuarioController.verHistorialUsuario(req, res)
})

export default usuarioRouter
