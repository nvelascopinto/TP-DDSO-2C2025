export class ItemPedido {
  constructor(producto, cantidad, precioUnitario) {
    this.producto = producto
    this.cantidad = cantidad
    this.precioUnitario = precioUnitario
  }

  subtotal() {
    return this.precioUnitario * this.cantidad
  }

  asignarProducto(producto) {
    this.producto = producto
    this.precioUnitario = producto.precio
  }

  validarStock() {
    return this.producto.estaDisponible(this.cantidad)
  }
}
