import { Router } from "express"
import ProductoController from "../controllers/productoController.js"
import { authenticateUser } from "../middleware/authenticationHandler.js"
const productoRouter = Router()

productoRouter.post("/", authenticateUser("X-User"), (req, res) => {
  return ProductoController.crear(req, res)
})

//autentico el vendedor que esta en el body ==>para poder luego obetnerlo y
productoRouter.get("/", authenticateUser("X-User"), (req, res) => {
  return ProductoController.obtenerTodosDeVendedor(req, res)
})

export default productoRouter
