import { Router } from "express"
import PedidoController from "../controllers/pedidoController.js"
import { authenticateUser } from "../middleware/authenticationHandler.js"
const pedidoRouter = Router()

pedidoRouter.get("/:id", (req, res) => {
  return PedidoController.consultar(req, res)
}) // deberia autenticarse y ver que lo vea alguien autorizado? deberia ir en el header?

pedidoRouter.post("/", authenticateUser('comprador'), authenticateUser('venedor'), (req, res) => {
  return PedidoController.crear(req, res)
})

pedidoRouter.post("/:id/cambioDeEstado", authenticateUser('usuario'), (req, res) => {
  return PedidoController.cambioEstado(req, res) // cambiar nombre
})

export default pedidoRouter
