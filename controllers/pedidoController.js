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
        const resultBody = pedidoSchema.safeParse(body)

        if (resultBody.error) {
            res.status(400).json(resultBody.error.issues)
            return
        }

        const nuevoPedido = this.pedidoService.crear(convertJSONtoPedido(resultBody.data))

        if (!nuevoPedido) {
            return res.status(409).json({
                error: "Stock insuficiente para uno o mas productos del pedido"
            })
        }

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
            res.status(400).json(resultBody.error.issues)
            return
        }
        // try {
            
        // } catch (error) {

        //     switch (error.name) {
        //         case "UsuarioInexistenteError":
        //             res.status(401).json({
        //                 message: error.message
        //             })
        //         case "PedidoInexistenteError":
        //             res.status(404).json({
        //                 message: error.message
        //             })
        //         case "YaEnEstadoError":
        //             res.status(409).json({
        //                 message: error.message
        //             })
        //         default:
        //             res.status(400)

        //     }
            
        // }

        const pedidoCancelado = this.pedidoService.cancelar(cambioEstado.body, id)
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

        res.json(pedido);
    }
}

const pedidoSchema = z.object({
    comprador: z.object({
        tipoUsuario: z.enum(Object.values(tipoUsuario))
    }),
    
}).refine(obj => obj.vendedor.tipoUsuario === tipoUsuario.VENDEDOR, {
    message: "El pedido solo puede ser vendido por un VENDEDOR"
})

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