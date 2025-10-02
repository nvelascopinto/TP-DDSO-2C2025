import { z } from "zod"
import { DatosInvalidos } from "../errors/datosInvalidos.js"

export const idTransform = z.string().transform((val, ctx) => {
  const num = Number(val)
  if (isNaN(num) || num < 0) {
    ctx.addIssue({
      code: "INVALID_ID",
      message: "id must be a positive number",
    })
    return z.NEVER
  }
  return num
})

export function validarId(id) {
  const resultId = idTransform.safeParse(id)

  if (resultId.error) {
    throw new DatosInvalidos("ID invalido", resultId.error.issues)
  }

  return resultId.data
}
