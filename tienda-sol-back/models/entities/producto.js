import { Moneda } from "./moneda.js"
import { MonedaInvalidaError } from "../../errors/domainValidationError.js"
import { UsuarioSinPermisoError } from "../../errors/authorizationError.js"
import { ProductoInactivoError, ProductoStockInsuficienteError } from "../../errors/conflicError.js"

export class Producto {
  constructor(vendedor, titulo, descripcion, categoria, precio, moneda, stock, fotos, activo) {
    // this._id = null //lo va a escribir mongo
    this.vendedor = vendedor 
    this.titulo = titulo
    this.descripcion = descripcion
    this.categoria = categoria
    this.precio = precio
    this.moneda = moneda
    this.stock = stock
    this.fotos = fotos
    this.activo = activo
    this.cantVentas = 0

    this.validarMoneda()
  }

  actualizarPrecio(nuevoPrecio) {
    this.precio = nuevoPrecio
  }

  actualizarActivo(nuevoEstado) {
    this.activo = nuevoEstado
  }


  estaDisponible() {
    if(!this.activo) throw new ProductoInactivoError(this._id)
  }

  tieneStock(cantidad) {
    if(this.stock < cantidad) throw new ProductoStockInsuficienteError(this._id)
  }

  validarCreador(idUsuario) {

    if (!(idUsuario == this.vendedor)) {
      throw new UsuarioSinPermisoError(idUsuario)
    }
  }

  reducirStock(cantidad) {
    this.stock -= cantidad
  }

  aumentarStock(cantidad) {
    this.stock += cantidad
  }

  reducirVentas(cantidad) {
    this.cantVentas -= cantidad
  }

  aumentarVentas(cantidad) {
    this.cantVentas += cantidad
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
      throw new MonedaInvalidaError(this.moneda)
    }
  }
}
