import { Router } from "express"
import ProductoController from "../controllers/productoController.js"

const productoRouter = Router()

productoRouter.post("/", (req, res) => {
  return ProductoController.crear(req, res)
})

productoRouter.get("/", (req, res) => {
  return ProductoController.listarSegunFiltros(req, res)
})

export default productoRouter