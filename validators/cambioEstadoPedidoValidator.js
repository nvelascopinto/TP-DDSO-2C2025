import { z } from "zod"

export const cambioEstadoPedidoValidator = z.object({
  motivo: z.string(),
  estado: z.string().optional(),
})
