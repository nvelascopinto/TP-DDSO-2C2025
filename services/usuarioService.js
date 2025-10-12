import usuarioRepository from "../models/repositories/usuarioRepository.js"
import pedidoService from "./pedidoService.js"
import { validarExistenciaDeUsuario } from "../validators/usuarioValidator.js"
import { fromUsuarioDTO } from "../converters/usuarioConverter.js"

class UsuarioService {
  /************************** CREAR UN USUARIO **************************/
  crearUsuario(usuarioDTO) {
    return Promise.resolve()
      .then(() => {
        const usuario = fromUsuarioDTO(usuarioDTO)
        return usuarioRepository.crear(usuario)
      })
      .then((usuarioCreado) => usuarioCreado)
  }

  /************************** CONSULTAR UN USUARIO **************************/
  buscar(id) {
    return usuarioRepository.findById(id).then((usuarioBuscado) => {
      validarExistenciaDeUsuario(usuarioBuscado, id)
      return usuarioBuscado
    })
  }

  /************************** CONSULTAR EL HISTORIAL DE UN USUARIO **************************/

  consultarHistorial(id, usuario) {
    return pedidoService.consultarHistorial(id, usuario).then((historial) => historial)
  }
}

export default new UsuarioService()
