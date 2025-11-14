import { z } from "zod"
import { itemPedidoValidator } from "./itemPedidoValidator.js"
import { direccionEntregaValidator } from "./direccionEntregaValidator.js"

export const pedidoValidator = z.object({
  vendedor :z.string(),
  items: z.array(itemPedidoValidator).min(1),
  moneda: z.string(),
  direccionEntrega: direccionEntregaValidator
})
