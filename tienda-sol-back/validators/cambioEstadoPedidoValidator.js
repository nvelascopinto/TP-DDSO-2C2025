import { z } from "zod"

export const cambioEstadoPedidoValidator = z.object({
  motivo: z.string().optional(),
  estado: z.string()
})
