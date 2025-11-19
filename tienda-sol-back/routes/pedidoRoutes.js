import { Router } from "express"
import pedidoController from "../controllers/pedidoController.js"
import { authenticateUser } from "../middleware/authenticationHandler.js"
const pedidoRouter = Router()

pedidoRouter.get("/:id", authenticateUser("X-User"), (req, res) => {
  return pedidoController.consultar(req, res)
})

pedidoRouter.post("/", authenticateUser("X-User"), (req, res) => {
  return pedidoController.crear(req, res)
})


pedidoRouter.patch("/:id", authenticateUser("X-User"), (req, res) => {
  return pedidoController.cambioEstado(req, res)
})

export default pedidoRouter
