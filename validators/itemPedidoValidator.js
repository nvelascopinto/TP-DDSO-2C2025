import { z } from "zod"

export const itemPedidoValidator = z.object({
  producto: z.string(),
  cantidad: z.number().nonnegative().min(1, {
    message: "La cantidad debe ser, entara, positiva y como minimo 1"
  }),
  precioUnitario: z.number().nonnegative({ message: "El precio debe ser un numero positivo" })
})
