import { z } from "zod"

export const cambioEstadoPedidoValidator = z.object({
  usuario: z.any(),
  motivo: z.string(),
  estado: z.string().optional(),
})
