import { PedidoService } from "../service/pedidoService.js"
import { z } from "zod"
import {tipoUsuario} from "../models/entities/tipoUsuario.js"
import { convertJSONtoPedido } from "../conversores/conversoresPedido.js"

export class PedidoController {

    constructor(pedidoService) {
        this.pedidoService = pedidoService
    }

    crear(req, res) {
        const body = req.body
        const pedido = convertJSONtoPedido(body)
        const nuevoPedido = this.pedidoService.crear(pedido)

        return res.status(201).json(nuevoPedido)
    }

    cancelar(req, res) {
        const resultId = idTransform.safeParse(req.params.id)

        if (resultId.error) {
            res.status(400).json(resultId.error.issues)
            return
        }

        const id = resultId.data

        const cambioEstadoBody = req.body
        const cambioEstado = cambioEstadoSchema.safeParse(cambioEstadoBody)
        if (cambioEstado.error) {
            res.status(400).json(cambioEstado.error.issues)
            return
        }
        const pedidoCancelado = this.pedidoService.cancelar(cambioEstado.data, id)
        res.status(200).json(pedidoCancelado)
        return
    }

    consultar(req, res) {
        const resultId = idTransform.safeParse(req.params.id)

        if (resultId.error) {
            res.status(400).json(resultId.error.issues)
            return
        }

        const id = resultId.data

        const pedido = this.pedidoService.consultar(id);

        if (!pedido) {
            res.status(404).json({
                error: "No existe el pedido que se intenta consultar"
            })
            return
        }

        res.status(200).json(pedido);
    }

    marcarEnviado(req, res) {
        const resultId = idTransform.safeParse(req.params.id)

        if (resultId.error) {
            res.status(400).json(resultId.error.issues)
            return
        }

        const id = resultId.data

        const cambioEstadoBody = req.body
        const cambioEstado = cambioEstadoSchema.safeParse(cambioEstadoBody)
        if (cambioEstado.error) {
            res.status(400).json(resultBody.error.issues)
            return
        }
        const pedidoEnviado = this.pedidoService.marcarEnviado(cambioEstado.body, id)
        res.status(200).json(pedidoEnviado)
        return
    }

    verHistorialUsuario(req, res) {
       const resultId = idTransform.safeParse(req.params.id)

        if (resultId.error) {
            res.status(400).json(resultId.error.issues)
            return
        }

        const id = resultId.data

        const pedido = this.pedidoService.consultarHistorial(id);

        res.status(200).json(pedido);
    }
}

/*const pedidoSchema = z.object({
    comprador: z.object({
        tipoUsuario: z.enum(Object.values(tipoUsuario))
    }),
    
}).refine(obj => obj.vendedor.tipoUsuario === tipoUsuario.VENDEDOR, {
    message: "El pedido solo puede ser vendido por un VENDEDOR"
})*/

const idTransform = z.string().transform(((val, ctx) => {
    const num = Number(val);
    if (isNaN(num)) {
        ctx.addIssue({
            code: "INVALID_ID",
            message: "id must be a number"
        });
        return z.NEVER;
    }
    return num;
}))

const cambioEstadoSchema = z.object({
    idUsuario: z.number().nonnegative(),
    motivo: z.string(),
})