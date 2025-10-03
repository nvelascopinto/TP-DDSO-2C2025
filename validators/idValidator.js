import { z } from "zod"

export const idValidator = z.string().transform((val, ctx) => {
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

