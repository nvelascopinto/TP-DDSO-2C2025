import { Router } from "express"
import productoController from "../controllers/productoController.js"
import { authenticateUser } from "../middleware/authenticationHandler.js"
const productoRouter = Router()

productoRouter.post("/", authenticateUser("X-User"), (req, res) => {
  return productoController.crear(req, res)
})

//autentico el vendedor que esta en el body ==>para poder luego obetnerlo y
productoRouter.get("/", authenticateUser("X-User"), (req, res) => {
  return productoController.obtenerTodosDeVendedor(req, res)
})

productoRouter.patch("/:id", authenticateUser("X-User"), (req, res) => {
  return productoController.actualizar(req, res)
})

export default productoRouter
