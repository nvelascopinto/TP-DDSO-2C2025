import { z } from "zod"
import { itemPedidoValidator } from "./itemPedidoValidator.js"
import { direccionEntregaValidator } from "./direccionEntregaValidator.js"
import PedidoInexistenteError from "../errors/pedidoInexistenteError.js"
import HistorialInexistenteError from "../errors/historialInexistenteError.js"
import { Usuario } from "../models/entities/usuario.js"

export const pedidoValidator = z.object({
  comprador: z.any(), // ver si esto funciona
  vendedor: z.any(),
  items: z.array(itemPedidoValidator).min(1),
  moneda: z.string(),
  direccionEntrega: direccionEntregaValidator,
})

export function validarExistenciaDePedido(pedido, id) {
  if (pedido == null) {
    throw new PedidoInexistenteError(id)
  }
}

export function validarExistenciaDeHistorial(historial, id) {
  if (historial.length == 0) {
    throw new HistorialInexistenteError(id)
  }
}
