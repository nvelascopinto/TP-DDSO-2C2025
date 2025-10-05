import { z } from "zod"

export const cambioEstadoPedidoValidator = z.object({
  // idUsuario: z.number().nonnegative(),
  motivo: z.string(),
  estado: z.string().optional(),
})
