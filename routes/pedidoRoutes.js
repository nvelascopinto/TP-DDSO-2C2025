import { Router } from "express"
import PedidoController from "../controllers/pedidoController.js"
import { authenticateUser } from "../middleware/authenticationHandler.js"
const pedidoRouter = Router()

pedidoRouter.get("/:id", authenticateUser("X-User"),(req, res) => {
  return PedidoController.consultar(req, res)
}) // deberia autenticarse y ver que lo vea alguien autorizado? deberia ir en el header?

pedidoRouter.post("/", authenticateUser('X-User'), (req, res) => {
  return PedidoController.crear(req, res)
})

pedidoRouter.post("/:id/cambioDeEstado", authenticateUser('X-User'), (req, res) => {
  return PedidoController.cambioEstado(req, res)
})

export default pedidoRouter
