import { Router } from "express"
import productoController from "../controllers/productoController.js"
import { authenticateUser } from "../middleware/authenticationHandler.js"
const productoRouter = Router()

productoRouter.post("/", authenticateUser("X-User"), (req, res) => {
  return productoController.crear(req, res)
})

productoRouter.get("/", authenticateUser("vendedor"), (req, res) => {
  return productoController.obtenerTodosDeVendedor(req, res)
})

productoRouter.patch("/:id", authenticateUser("X-User"), (req, res) => {
  return productoController.actualizar(req, res)
})

productoRouter.get("/:id", (req, res) => {
  return productoController.obtenerProducto(req, res)
})

export default productoRouter
