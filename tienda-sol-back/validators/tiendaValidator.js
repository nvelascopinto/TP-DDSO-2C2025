import { z } from "zod"
export const tiendaValidator = z.object({
  nombre: z.string().min(1, "El nombre de la tienda no puede estar vacio"),
  descripcion: z.string().min(1, "La descripcion no puede estar vacia"),
})