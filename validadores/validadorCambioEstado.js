import { z } from "zod"
import { DatosInvalidos } from "../errors/datosInvalidos.js"

const cambioEstadoSchema = z.object({
  idUsuario: z.number().nonnegative(),
  motivo: z.string(),
  estado: z.string().optional(),
})

export function validarCambioEstado(body) {
  const cambioEstado = cambioEstadoSchema.safeParse(body)

  if (cambioEstado.error) {
    throw new DatosInvalidos(
      "Datos de cambio de estado invalidos",
      cambioEstado.error.issues,
    )
  }

  return cambioEstado.data
}
