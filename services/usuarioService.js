import usuarioRepository from "../models/repositories/usuarioRepository.js"
import pedidoService from "./pedidoService.js"
import { fromUsuarioDTO } from "../converters/usuarioConverter.js"
import { UsuarioInexistenteError } from "../errors/notFoundError.js"

class UsuarioService {
  /************************** CREAR UN USUARIO **************************/
  crearUsuario(usuarioDTO) {
    return Promise.resolve()
      .then(() => {
        const usuario = fromUsuarioDTO(usuarioDTO)
        return usuarioRepository.crear(usuario)
      })
  }

  /************************** CONSULTAR UN USUARIO **************************/
  buscar(id) {
    return usuarioRepository.findById(id)
      .then((usuarioBuscado) => {
        if (!usuarioBuscado) throw new UsuarioInexistenteError(id)
        return usuarioBuscado
      })
  }

  /************************** CONSULTAR EL HISTORIAL DE UN USUARIO **************************/

  consultarHistorial(id, usuario) {
    return pedidoService.consultarHistorial(id, usuario)
  }
}

export default new UsuarioService()
