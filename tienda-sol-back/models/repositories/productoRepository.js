import { ProductoModel } from "../schemas/productoSchema.js"
class ProductoRepository {
  constructor() {
    this.model = ProductoModel
  }

  crear(producto) {
    const productoNuevo = new this.model(producto)
    return productoNuevo.save()
  }

  update(productoModificado, id) {
    console.log("PRODUCTO MODIFICADO"+ productoModificado.precio)
    return this.model.findByIdAndUpdate(id, productoModificado, { new: true })
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
  
  // CORREGIDO: era "titlo" y ahora verifica tanto "nombre" como "titulo"
  if (filtros.nombre != null && filtros.nombre.trim() !== '') {
    query.titulo = { $regex: filtros.nombre, $options: "i" }
  }
  
  if (filtros.titulo != null && filtros.titulo.trim() !== '') {
    query.titulo = { $regex: filtros.titulo, $options: "i" }
  }
  
  if (filtros.categoria != null && filtros.categoria.trim() !== '') {
    query.categoria = { $regex: filtros.categoria, $options: "i" }
  }
  
  if (filtros.descripcion != null && filtros.descripcion.trim() !== '') {
    query.descripcion = { $regex: filtros.descripcion, $options: "i" }
  }
  
  return query
}

mapSort(orden) {
  // CORREGIDO: ahora acepta tanto el formato viejo como el nuevo
  switch (orden) {
    case "asc":
    case "precioAsc":
      return { precio: 1 }
    case "desc":
    case "precioDesc":
      return { precio: -1 }
    case "masVendido":
      return { cantVentas: -1 }
    default:
      return { cantVentas: -1 } // Por defecto más vendidos
  }
} 
}

export default new ProductoRepository()
