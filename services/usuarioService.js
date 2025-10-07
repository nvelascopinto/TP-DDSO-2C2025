import UsuarioRepository from "../models/repositories/usuarioRepository.js"
import { pedidoServiceInstance } from "./pedidoService.js"
import {
  rolesValidator,
  validarExistenciaDeUsuario,
} from "../validators/usuarioValidator.js"
import { fromUsuarioDTO } from "../converters/usuarioConverter.js"

export class UsuarioService {
  constructor(UsuarioRepository, pedidoServiceInstance) {
    this.UsuarioRepository = UsuarioRepository
    this.PedidoService = pedidoServiceInstance
  }
  /************************** "VALIDAR" UN USUARIO **************************/
  obtenerUsuario(id, roles) {
    console.log(id)
    return this.UsuarioRepository.findById(id).then((usuario) => {
      validarExistenciaDeUsuario(usuario, id)
      rolesValidator(usuario, roles)
      return usuario
    })
    // validarExistenciaDeUsuario(user, id)
  } // falta manejo de promises depsues de ver que hacemos con lo del authorization
  //DEBERIAMOS SACAR ESTE METODOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
  /************************** CREAR UN USUARIO **************************/
  crearUsuario(usuarioDTO) {
    return Promise.resolve()
      .then(() => {
        usuario = fromUsuarioDTO(usuarioDTO)
        return this.UsuarioRepository.crear(usuario)
      })
      .then((usuarioCreado) => usuarioCreado)
  }

  /************************** CONSULTAR UN USUARIO **************************/
  buscar(id) {
    return this.UsuarioRepository.findById(id).then((usuarioBuscado) => {
      validarExistenciaDeUsuario(usuarioBuscado, id)
      return usuarioBuscado
    })
  }

  /************************** CONSULTAR EL HISTORIAL DE UN USUARIO **************************/

  consultarHistorial(id) {
    return this.PedidoService.consultarHistorial(id).then((historial) => {
      return historial
    })
  }
}

export const usuarioServiceInstance = new UsuarioService(
  UsuarioRepository,
  pedidoServiceInstance,
)
