import { Router } from "express"
import ProductoController from "../controllers/productoController.js"

const productoRouter = Router()

productoRouter.post("/", (req, res) => {
  return ProductoController.crear(req, res)
})

productoRouter.get("/vendedor/:idvendedor", (req, res) => {
  return ProductoController.listarPorVendedor(req, res)
})

export default productoRouter