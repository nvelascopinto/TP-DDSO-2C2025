import { Router } from "express"
import ProductoController from "../controllers/productoController.js"

const productoRouter = Router()

productoRouter.post("/", (req, res) => {
  return ProductoController.crear(req, res)
})

productoRouter.get("/:idusuario", (req, res) => {
  return ProductoController.deEsteVendedor(req, res) //cambiar nombre >:/
})

export default productoRouter
