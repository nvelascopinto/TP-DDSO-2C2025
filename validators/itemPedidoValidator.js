import { z } from "zod"
import { idMongoValidator } from "./idValidator.js"

export const itemPedidoValidator = z.object({
  producto: idMongoValidator,
  cantidad: z.number().nonnegative().min(1, {
    message: "La cantidad debe ser, entara, positiva y como minimo 1"
  })
})
