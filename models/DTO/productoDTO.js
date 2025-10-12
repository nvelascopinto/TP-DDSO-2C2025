export class ProductoDTO {
  constructor(titulo, descripcion, categoria, precio, moneda, stock, fotos, activo) {
    // this.vendedorID = vendedorID
    this.titulo = titulo
    this.descripcion = descripcion
    this.categoria = categoria
    this.precio = precio
    this.moneda = moneda
    this.stock = stock
    this.fotos = fotos
    this.activo = activo
  }
}
