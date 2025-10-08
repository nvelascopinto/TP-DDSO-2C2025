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
  /************************** CREAR UN USUARIO **************************/
  crearUsuario(usuarioDTO) {
    return Promise.resolve()
      .then(() => {
        const usuario = fromUsuarioDTO(usuarioDTO)
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

  consultarHistorial(id,usuario) {
    return this.PedidoService.consultarHistorial(id,usuario).then((historial) => {
      return historial
    })
  }
}

export const usuarioServiceInstance = new UsuarioService(
  UsuarioRepository,
  pedidoServiceInstance,
)
