import { Router } from "express"
import tiendaController from "../controllers/tiendaController.js"

const tiendaRouter = Router()

tiendaRouter.get("/", (req, res) => {
  return tiendaController.getTiendas(req, res)
})

tiendaRouter.get("/:id", (req, res) => {
  return tiendaController.getTiendaByName(req, res)
})

export default tiendaRouter