import ProductoRepository from "../models/repositories/productoRepository.js"
import UsuarioService from "./usuarioService.js"
import { tipoUsuario } from "../models/entities/tipoUsuario.js"
import { validarExistenciaDeProducto } from "../validators/productoValidator.js"
import { fromProductoDTO } from "../converters/productoConverter.js"
import { rolesValidator } from "../validators/usuarioValidator.js"

class ProductoService {
  /************************** CREAR UN PRODUCTO **************************/
  crear(productoDTO, vendedor) {
    return Promise.resolve().then(()=>{
        const producto = fromProductoDTO(productoDTO)
        rolesValidator(vendedor, [tipoUsuario.VENDEDOR])
    
      return ProductoRepository.crear(producto)
    }).then((productoGuardado) => productoGuardado)
  }

  /************************** CONSULTAR UN PRODUCTO **************************/
  obtenerProducto(id) {
    //validarExistenciaDeProducto(producto, id)
    return ProductoRepository.findById(id)
    .then((producto) => producto)
  }

  /************************** CONSULTAR TODOS LOS PRODUCTOS DE UN VENDEDOR **************************/
obtenerTodosDeVendedor(vendedor,filtros, pagina, limite) {
  return Promise.resolve().then(()=> {
      rolesValidator(vendedor,[tipoUsuario.VENDEDOR])
      return ProductoRepository.obtenerTodosDeVendedor(vendedor._id,filtros, pagina, limite)
  }).then((prodVendedor) => prodVendedor)
  }

/*ordenarPorPrecio(productos, tipoOrdenamiento){
  if (tipoOrdenamiento == "asc"){
    return productos.sort((a, b) => a.precio - b.precio);
  }
  else if (tipoOrdenamiento == "desc"){
    return productos.sort((a, b) => b.precio - a.precio);
  }
}*/

ordenarPorPrecioAscendente(productos){
  return productos.sort((a, b) => a.precio - b.precio);

}
ordenarPorPrecioDescendente(productos){
  return productos.sort((a, b) => b.precio - a.precio);

}
ordenarPorMasVendido(productos){
  return productos.sort((a, b) => pedidoService.cantidadVentasProducto(b) - pedidoService.cantidadVentasProducto(a));
}
}

export default new ProductoService(ProductoRepository, UsuarioService)