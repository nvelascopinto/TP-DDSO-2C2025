import { z } from "zod"

const cambioEstadoPedidoValidator = z.object({
  idUsuario: z.number().nonnegative(),
  motivo: z.string(),
  estado: z.string().optional(),
})

export default cambioEstadoPedidoValidator
