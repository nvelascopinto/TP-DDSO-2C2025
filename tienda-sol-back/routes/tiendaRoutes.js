import { Router } from "express"
import {TiendaController} from "../controllers/tiendaController.js"
export const tiendaRouter = Router()

tiendaRouter.get("/", (req, res) => {
  return TiendaController.getTiendas(req, res)
})

tiendaRouter.get("/:id", (req, res) => {
  return TiendaController.getTiendaByName(req, res)
})