import { z } from "zod"
import { tipoUsuario } from "../models/entities/tipoUsuario.js"

const usuarioValidator = z.object({
  nombre: z.string().min(1, "El nombre no puede estar vacío"),
  email: z.string(),
  telefono: z.string(),
  tipoUsuario: z.string(),
})

export default usuarioValidator
