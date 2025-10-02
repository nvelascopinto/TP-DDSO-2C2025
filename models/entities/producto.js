import { z } from "zod"
import { tipoUsuario } from "./tipoUsuario.js"

export class Producto {
  constructor(
    vendedor,
    titulo,
    descripcion,
    categoria,
    precio,
    moneda,
    stock,
    fotos,
    activo,
  ) {
    this.id = null
    this.vendedor = vendedor
    this.titulo = titulo
    this.descripcion = descripcion
    this.categoria = categoria
    this.precio = precio
    this.moneda = moneda
    this.stock = stock
    this.fotos = fotos
    this.activo = activo
  }

  estaDisponible(cantidad) {
    return this.stock >= cantidad && this.activo
  }

  reducirStock(cantidad) {
    this.stock -= cantidad
  }

  aumentarStock(cantidad) {
    this.stock += cantidad
  }

  mostrarProducto() {
    return (
      "VENDEDOR : " +
      this.vendedor +
      "/n TITULO: " +
      this.titulo +
      "/n DESCRIPCION: " +
      this.descripcion +
      "/n CATEGORIA: " +
      this.categoria +
      "/n PRECIO UNITARIO: " +
      this.precio +
      "/n MONEDA: " +
      this.moneda +
      "/n STOCK DISPONIBLE: " +
      this.stock +
      "/n FOTOS: " +
      this.fotos
    )
  }
}

// mover cuando tenga su controller o a una carpeta schema
export const productoSchema = z
  .object({
    stock: z.number().nonnegative(),
    precio: z.number().nonnegative(),
    vendedor: z.object({
      tipoUsuario: z.enum(Object.values(tipoUsuario)),
    }),
  })
  .refine((obj) => obj.vendedor.tipoUsuario === tipoUsuario.VENDEDOR, {
    message: "El producto solo puede ser asignado a un usuario VENDEDOR",
  })
