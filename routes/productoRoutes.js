import {ProductoController} from "../controllers/productoController.js"
import express from "express"
import { productoErrorHandler } from "../middleware/productoMiddleware.js"
import { ErrorHandler } from "../middleware/middlware.js"

const pathProducto = "/productos"

export default function ProductosRoutes(getController) {
    const router = express.Router()

    router.post(pathProducto, (req, res, next) => {
       
        try { 
             getController(ProductoController).crear(req, res)
        } catch (err) {
            next(err)
        }
    })
    router.use(ErrorHandler)
    return router
}