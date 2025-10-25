import { z } from "zod"
import mongoose from "mongoose"

export const idValidator = z.string("El username ingresado es invalido")

export const idMongoValidator = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), { message: "El ID ingresado es invalido" })
