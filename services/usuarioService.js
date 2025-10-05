import UsuarioRepository from "../models/repositories/usuarioRepository.js"
import PedidoService from "./pedidoService.js"
import PedidoRepository from "../models/repositories/pedidoRepository.js"
// import PedidoService from "./pedidoService.js";
import { validarExistenciaDeUsuario } from "../validators/usuarioValidator.js"
import { fromUsuarioDTO } from "../converters/usuarioConverter.js"

class UsuarioService {
  constructor(usuarioRepository, pedidoService) {
    this.usuarioRepository = usuarioRepository
    this.pedidoService = pedidoService
  }

  /************************** "VALIDAR" UN USUARIO **************************/
  obtenerUsuario(id, roles) {
    return this.usuarioRepository.findById(id)
    .then((usuario) => {
      usuario.validarRol(roles)
      return usuario
    })
    // validarExistenciaDeUsuario(user, id)
  } // falta manejo de promises depsues de ver que hacemos con lo del authorization

  /************************** CREAR UN USUARIO **************************/
  crearUsuario(usuarioDTO) {
    const usuario = fromUsuarioDTO(usuarioDTO) 

    return this.usuarioRepository.crear(usuario)
    .then((usuarioCreado) => usuarioCreado)
  }

  /************************** CONSULTAR UN USUARIO **************************/
  buscar(id) {
    return this.usuarioRepository.findById(id)
      .then((usuarioBuscado) => usuarioBuscado)
    //validarExistenciaDeUsuario(usuario, id)
  }

  /************************** CONSULTAR EL HISTORIAL DE UN USUARIO **************************/

  // TODO: Solucionar dependencia circular entre servicios: pedidos y usuarios
  consultarHistorial(id) {
    // CAMBIAR A PEDIDO SERVICE DESPUES DE SOLUCIONAR LO DE AUTORIZACION !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    return this.pedidoRepository.consultarHistorial(id) 
    .then((historial) => historial)
  }
}

export default new UsuarioService(UsuarioRepository, PedidoRepository)
