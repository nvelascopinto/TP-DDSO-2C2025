import {PedidoController} from "../controllers/pedidoController.js"

import express from "express"

const pathPedido = "/pedido"

export default function pedidosRoutes(getController) {
    const router = express.Router()

    router.patch(pathPedido + "/:id", (res,req) => {
        getController(PedidoController).cancelar(req,res)
    })




    router.post(pathPedido, (req, res) => {
        getController(PedidoController).crear(req, res)
    })
}