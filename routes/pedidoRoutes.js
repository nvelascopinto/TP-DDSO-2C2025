import {PedidoController} from "../controllers/pedidoController.js"

import express from "express"

const pathPedido = "/pedido"

export default function pedidosRoutes(getController) {
    const router = express.Router()

    router.patch(pathPedido + "/:id", (req,res) => {
        getController(PedidoController).cancelar(req,res)
    })

    router.get(pathPedido + "/:id", (req, res) => {
        getController(PedidoController).consultar(req, res)
    })

    router.post(pathPedido, (req, res) => {
        getController(PedidoController).crear(req, res)
    })

    return router
}