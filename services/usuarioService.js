import UsuarioRepository from "../models/repositories/usuarioRepository.js"
import PedidoService from "./pedidoService.js"
// import PedidoService from "./pedidoService.js";
import { rolesValidator, validarExistenciaDeUsuario } from "../validators/usuarioValidator.js"
import { fromUsuarioDTO } from "../converters/usuarioConverter.js"
import { validarExistenciaDeHistorial } from "../validators/pedidoValidator.js"

class UsuarioService {
  constructor() {
    this.UsuarioRepository = UsuarioRepository
    this.PedidoService = PedidoService
  }
  /************************** "VALIDAR" UN USUARIO **************************/
  obtenerUsuario(id, roles) {
    console.log(id)
    return UsuarioRepository.findById(id)
    .then((usuario) => {
      validarExistenciaDeUsuario(usuario, id)
      rolesValidator(usuario, roles)
      return usuario
    })
    // validarExistenciaDeUsuario(user, id)
  } // falta manejo de promises depsues de ver que hacemos con lo del authorization
//DEBERIAMOS SACAR ESTE METODOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO 
  /************************** CREAR UN USUARIO **************************/
  crearUsuario(usuarioDTO) {
    const usuario = fromUsuarioDTO(usuarioDTO) 

    return UsuarioRepository.crear(usuario)
    .then((usuarioCreado) => usuarioCreado)
  }

  /************************** CONSULTAR UN USUARIO **************************/
  buscar(id) {
    return UsuarioRepository.findById(id)
      .then((usuarioBuscado) => {
        validarExistenciaDeUsuario(usuarioBuscado, id)
        return usuarioBuscado
      })
    
  }

  /************************** CONSULTAR EL HISTORIAL DE UN USUARIO **************************/

  consultarHistorial(id) {
    return PedidoService.consultarHistorial(id) 
    .then((historial) => {
      return historial
    })
  }
}

export default new UsuarioService()
