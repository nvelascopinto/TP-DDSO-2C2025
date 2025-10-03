import { Router } from "express"
import ProductoController from "../controllers/productoController.js"

const productoRouter = Router()

productoRouter.post("/", (req, res) => {
  ProductoController.crear(req, res)
})

productoRouter.get("/:idusuario", (req, res) => {
  ProductoController.deEsteVendedor(req, res) //cambiar nombre >:/
})

export default productoRouter
