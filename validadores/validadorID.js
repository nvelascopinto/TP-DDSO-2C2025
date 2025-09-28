import {z} from "zod"

export const idTransform = z.string().transform((val, ctx) => {
  const num = Number(val)
  if (isNaN(num)) {
    ctx.addIssue({
      code: "INVALID_ID",
      message: "id must be a number",
    });
    return z.NEVER
  }
  return num
})

export function validarId(id) {
  const resultId = idTransform.safeParse(id)

  if (resultId.error) {
    res.status(400).json(resultId.error.issues)
    return
  }

  return resultId.data;
}