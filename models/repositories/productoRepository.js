import { ProductoModel } from "../schemas/productoSchema.js"
class ProductoRepository {
  constructor() {
    this.model = ProductoModel
  }

  crear(producto) {
    const productoNuevo = new this.model(producto)
    return productoNuevo.save()
  }

  actualizar(id, productoModificado) {
    return this.model.findByIdAndUpdate(id, productoModificado)
  }
  
  findById(id) {
    return this.model.findById(id).populate("vendedor")
  }

  obtenerTodosDeVendedor(idVendedor) {
    return this.model.find({ vendedor: idVendedor })
  }
}

export default new ProductoRepository()
