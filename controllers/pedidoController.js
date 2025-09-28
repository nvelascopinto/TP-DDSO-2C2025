import { PedidoService } from "../service/pedidoService.js"
import { z } from "zod"
import {tipoUsuario} from "../models/entities/tipoUsuario.js"
import { convertJSONtoPedido } from "../conversores/conversoresPedido.js"
import { validarId } from "../validadores/validadorID.js"
import { validarCambioEstado } from "../validadores/validadorCambioEstado.js"

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
        const id = validarId(req.params.id)
        const cambioEstado = validarCambioEstado(req.body)
        const pedidoCancelado = this.pedidoService.cancelar(cambioEstado, id)

        res.status(200).json(pedidoCancelado)
        return
    }

    consultar(req, res) {
        const id = validarId(req.params.id)

        const pedido = this.pedidoService.consultar(id)

        if (!pedido) {
            res.status(404).json({
                error: "No existe el pedido que se intenta consultar"
            })
            return
        }

        res.status(200).json(pedido);
    }

    marcarEnviado(req, res) {
        const id = validarId(req.params.id)
        
        const envioBody = req.body
        const idVendedor = idSchema.safeParse(envioBody)
        if (idVendedor.error) {
            res.status(400).json(idVendedor.error.issues)
            return
        }
        const pedidoEnviado = this.pedidoService.marcarEnviado(idVendedor.data.idVendedor, id)
        res.status(200).json(pedidoEnviado)
        return
    }

    cambioEstado (req,res) {
        const id = validarId(req.params.id)
        const cambioEstado = validarCambioEstado(req.body)
        const pedidoModificado = this.pedidoService.cambioEstado(cambioEstado, id)

        res.status(200).json(pedidoModificado)
        return
    }

}

const idSchema = z.object({
    idVendedor: z.number().nonnegative()
})