import { Router } from "express"
import PedidoController from "../controllers/pedidoController.js"

const pedidoRouter = Router()

pedidoRouter.get("/:id", (req, res) => {
  PedidoController.consultar(req, res)
})

pedidoRouter.post("/", (req, res) => {
  PedidoController.crear(req, res)
})

pedidoRouter.post("/:id/cambioDeEstado", (req, res) => {
  PedidoController.cambioEstado(req, res) // cambiar nombre
})

export default pedidoRouter
