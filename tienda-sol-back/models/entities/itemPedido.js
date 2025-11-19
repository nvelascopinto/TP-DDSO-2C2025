
export class ItemPedido {
  constructor(producto, cantidad) {
    this.producto = producto
    this.cantidad = cantidad
    this.precioUnitario = producto.precio
  }

  subtotal() {
    return this.precioUnitario * this.cantidad
  }

  // asignarProducto(producto) {
  //   this.producto = producto
  //   this.precioUnitario = producto.precio
  // }

  actualizarStock() {
    this.producto.estaDisponible() 
    this.producto.tieneStock(this.cantidad)
  }
}
