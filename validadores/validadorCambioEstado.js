import { z } from "zod";

const cambioEstadoSchema = z.object({
  idUsuario: z.number().nonnegative(),
  motivo: z.string(),
  estado: z.string().optional(),
});

export function validarCambioEstado(body) {
  const cambioEstado = cambioEstadoSchema.safeParse(body)
  if (cambioEstado.error) {
    res.status(400).json(cambioEstado.error.issues)
    return
  }
  return cambioEstado.data
}