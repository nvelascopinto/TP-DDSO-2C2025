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
    return this.model.findByIdAndUpdate(id, productoModificado, {
      new: true
    })
  }

  findById(id) {
    return this.model.findById(id)
  }

  obtenerTodosDeVendedor(idVendedor, filtros = {}, pagina, limite) {
    console.log("FILTROS EN REPO", filtros)
    const query = this.mapFilter(filtros, idVendedor)
    const sort = this.mapSort(filtros.orden)

    if (!limite) {
      limite = 5
    }
    const desplazamiento = pagina && limite ? (pagina - 1) * limite : 0
    console.log("DESPLAZAMIENTO", desplazamiento)
    console.log("LIMITE", limite)
    console.log("ORDEN", sort)

    return this.model.find(query).sort(sort).skip(desplazamiento).limit(limite)
  }

  mapFilter(filtros, idVendedor) {
    const query = { vendedor: idVendedor }
    const { nombre, categoria, descripcion, minPrecio, maxPrecio } = filtros
    if (minPrecio || maxPrecio) {
      query.precio = {}
      if (minPrecio) query.precio.$gte = minPrecio
      if (maxPrecio) query.precio.$lte = maxPrecio
    }
    if (nombre != null) {
      query.nombre = { $regex: nombre, $options: "i" }
    }
    if (categoria != null) {
      query.categoria = { $regex: categoria, $options: "i" }
    }
    if (descripcion != null) {
      query.descripcion = { $regex: descripcion, $options: "i" }
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
