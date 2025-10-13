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
    return this.model.findByIdAndUpdate(productoModificado._id, productoModificado, {
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

    const desplazamiento = (pagina - 1) * limite
    console.log("DESPLAZAMIENTO", desplazamiento)
    console.log("LIMITE", limite)
    console.log("ORDEN", sort)

    return this.model.countDocuments(query).then((total) => {
      return this.model
        .find(query)
        .sort(sort)
        .skip(desplazamiento)
        .limit(limite)
        .then((productos) => {
          return { productos, total, pagina, limite }
        })
    })
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
