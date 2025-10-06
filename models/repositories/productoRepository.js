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

  obtenerTodosDeVendedor(idVendedor, filtros = {}, pagina, limite) {
    const query = this.mapFilter(filtros,idVendedor) 
    const desplazamiento = pagina && limite ? (pagina - 1) * limite : 0

    const vendedoresFiltrados = this.model.find(query).skip(desplazamiento).limit(limite)
 
    return vendedoresFiltrados
  }

  mapFilter(filtros,idVendedor)
  {
    const query = { vendedor: idVendedor }
    const { nombre, categoria, descripcion, minPrecio, maxPrecio, pagina, limite } = filtros
    if (minPrecio || maxPrecio) {
    query.precio = {}
      if (minPrecio) query.precio.$gte = minPrecio
      if (maxPrecio) query.precio.$lte = maxPrecio
    }
    if(nombre != null) {
      query.nombre = { $regex:nombre, $options: 'i' }
    }
    if(categoria != null) {
      query.categoria = { $regex:categoria, $options: 'i' }
    }
    if(descripcion != null) {
      query.descripcion = { $regex:descripcion, $options: 'i' }
    }
  }
}


export default new ProductoRepository()
