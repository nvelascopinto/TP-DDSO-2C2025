import { z } from "zod"
import { itemPedidoValidator } from "./itemPedidoValidator.js"
import { direccionEntregaValidator } from "./direccionEntregaValidator.js"
import { idValidator } from "./idValidator.js"

export const pedidoValidator = z.object({
  // comprador: idValidator, // ver si esto funciona
  // vendedor: idValidator,
  vendedor :z.string(),
  items: z.array(itemPedidoValidator).min(1),
  moneda: z.string(),
  direccionEntrega: direccionEntregaValidator
})
