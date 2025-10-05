import UsuarioRepository from "../models/repositories/usuarioRepository.js"
import PedidoService from "./pedidoService.js"
import PedidoRepository from "../models/repositories/pedidoRepository.js"
// import PedidoService from "./pedidoService.js";
import { validarExistenciaDeUsuario } from "../validators/usuarioValidator.js"
import { fromUsuarioDTO } from "../converters/usuarioConverter.js"

class UsuarioService {

  /************************** "VALIDAR" UN USUARIO **************************/
  obtenerUsuario(id, roles) {
    return UsuarioRepository.findById(id)
    .then((usuario) => {
      usuario.validarRol(roles)
      return usuario
    })
    // validarExistenciaDeUsuario(user, id)
  } // falta manejo de promises depsues de ver que hacemos con lo del authorization

  /************************** CREAR UN USUARIO **************************/
  crearUsuario(usuarioDTO) {
    const usuario = fromUsuarioDTO(usuarioDTO) 

    return UsuarioRepository.crear(usuario)
    .then((usuarioCreado) => usuarioCreado)
  }

  /************************** CONSULTAR UN USUARIO **************************/
  buscar(id) {
    return UsuarioRepository.findById(id)
      .then((usuarioBuscado) => usuarioBuscado)
    //validarExistenciaDeUsuario(usuario, id)
  }

  /************************** CONSULTAR EL HISTORIAL DE UN USUARIO **************************/

  // TODO: Solucionar dependencia circular entre servicios: pedidos y usuarios
  consultarHistorial(id) {
    // CAMBIAR A PEDIDO SERVICE DESPUES DE SOLUCIONAR LO DE AUTORIZACION !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    return PedidoRepository.consultarHistorial(id) 
    .then((historial) => historial)
  }
}

export default new UsuarioService(UsuarioRepository, PedidoRepository)
