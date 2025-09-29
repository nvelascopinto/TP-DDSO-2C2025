import { PedidoController } from "../controllers/pedidoController.js"
import { errorHandler } from "../middleware/middlware.js"
import express from "express"

const pathPedido = "/pedidos"

export default function pedidoRoutes(getController) {
    const router = express.Router()

    
    router.get(pathPedido + "/:id", (req, res, next) => {
        
        try { 
            getController(PedidoController).consultar(req, res)
        } catch (err) {
            next(err)
        }
    })

    router.post(pathPedido, (req, res, next) => {
       
        try { 
             getController(PedidoController).crear(req, res)
        } catch (err) {
            next(err)
        }
    })

    router.post(pathPedido + "/:id/cambioDeEstado", (req, res, next) => {
        try {
            getController(PedidoController).cambioEstado(req, res); // cambiar nombre
        } catch (err) {
            next(err);
        }
    });

    router.use(errorHandler)
    return router
}