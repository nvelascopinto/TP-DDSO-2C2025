import { Moneda } from "./moneda.js"
import DatosInvalidosError from "../../errors/datosInvalidosError.js"

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

    this.validarMoneda()
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

  validarMoneda() {
    if (!Object.values(Moneda).includes(this.moneda)) {
      throw new DatosInvalidosError(
        "La moneda ingresada no esta dentro de las opciones ofrecidas",
      )
    }
  }
}
