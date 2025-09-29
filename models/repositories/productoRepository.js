export class ProductoRepository {
  constructor() {
    this.productos = [];
    this.nextId = 1;
  }

  crear(producto) {
    producto.id = this.nextId++;
    this.productos.push(producto);
    return producto;
  }

  actualizar(id, productoModificado) {
    const indice = this.productos.findIndex((p) => p.id === id);
    if (indice === -1) return null;
    const nuevoProducto = {
      ...this.productos[indice],
      ...productoModificado,
    };
    this.productos[indice] = nuevoProducto;
    return nuevoProducto;
  }
  findById(id) {
    return this.productos.find((p) => p.id === id) || null;
  }
}
