import { ProductoModel } from "../schemas/productoSchema.js"
class ProductoRepository {
  constructor() {
    this.model = ProductoModel
  }

  crear(producto) {
    const productoNuevo = new this.model(producto)
    return productoNuevo.save()
  }

  update(productoModificado) {
    return this.model.findByIdAndUpdate(productoModificado._id, productoModificado, { new: true })
  }

  findById(id) {
    return this.model.findById(id)
  }

  obtenerTodosDeVendedor(idVendedor, filtros = {}, pagina, limite) {
    const query = this.mapFilter(filtros, idVendedor)
    const sort = this.mapSort(filtros.orden)
    const desplazamiento = (pagina - 1) * limite

    return this.model.countDocuments(query)
      .then((total) => {
        return this.model
          .find(query)
          .sort(sort)
          .skip(desplazamiento)
          .limit(limite)
          .then((productos) => ({ productos, total, pagina, limite }))
      })
  }

  mapFilter(filtros, idVendedor) {
    const query = { vendedor: idVendedor }
    if (filtros.minPrecio || filtros.maxPrecio) {
      query.precio = {}
      if (filtros.minPrecio) query.precio.$gte = filtros.minPrecio
      if (filtros.maxPrecio) query.precio.$lte = filtros.maxPrecio
    }
    if (filtros.nombre != null) {
      query.nombre = { $regex: filtros.nombre, $options: "i" }
    }
    if (filtros.categoria != null) {
      query.categoria = { $regex: filtros.categoria, $options: "i" }
    }
    if (filtros.descripcion != null) {
      query.descripcion = { $regex: filtros.descripcion, $options: "i" }
    }
    return query
  }

  mapSort(orden) {
    // valores esperados: "precioAsc", "precioDesc", "masVendido"
    switch (orden) {
      case "precioAsc":
        return { precio: 1 }
      case "precioDesc":
        return { precio: -1 }
      case "masVendido":
        return { cantVentas: -1 }
      default:
        return {} // sin orden específico
    }
  }
}

export default new ProductoRepository()
