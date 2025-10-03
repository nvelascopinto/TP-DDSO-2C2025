import { z } from "zod"
import DatosInvalidosError from "../errors/datosInvalidosError.js"

export const itemPedidoValidator = z.object({
  producto: z.number().nonnegative(),
  cantidad: z.number().nonnegative().min(1, {
    message: "La cantidad debe ser, entara, positiva y como minimo 1",
  }),
  precioUnitario: z
    .number()
    .nonnegative({ message: "El precio debe ser un numero positivo" }),
})

export function validarItemsConVendedor(items, vendedorID) {
  if (!items.every((item) => item.producto.vendedor.id === vendedorID)) {
    throw new DatosInvalidosError(
      "Los productos del pedido deben ser todos del mismo vendedor",
    )
  }
}
