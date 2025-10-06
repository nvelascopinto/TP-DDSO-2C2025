import { Router } from "express"
import ProductoController from "../controllers/productoController.js"
import { authenticateUser } from "../middleware/authenticationHandler.js"
const productoRouter = Router()

productoRouter.post("/", authenticateUser('vendedor'), (req, res) => {
  return ProductoController.crear(req, res)
})

//header X-User
productoRouter.get("/", authenticateUser('X-User'), (req, res) => {
  return ProductoController.obtenerTodosDeVendedor(req, res)
})

export default productoRouter