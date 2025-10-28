import usuarioRepository from "../models/repositories/usuarioRepository.js"
import pedidoService from "./pedidoService.js"
import { fromUsuarioDTO } from "../converters/usuarioConverter.js"
import { UsuarioInexistenteError } from "../errors/notFoundError.js"
import { YaExisteUsuarioError } from "../errors/conflicError.js"
import { UsuarioWrongPassword } from "../errors/authorizationError.js"
class UsuarioService {
  /************************** CREAR UN USUARIO **************************/
  crearUsuario(usuarioDTO) {
    return Promise.resolve()
      .then(() => {
        const usuario = fromUsuarioDTO(usuarioDTO)
        const createdUser = usuarioRepository.crear(usuario)
        return {
          username : createdUser.username,
          tipo : createdUser.tipoUsuario
        }
      }).catch((error) => {
          if (error.name === "MongoServerError" && error.code === 11000) {
              throw new YaExisteUsuarioError(usuarioDTO.username)
          }
          throw error
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

  autenticarUser(username, password) {
    return this.buscar(username).then((usuarioBuscado)=>{
      if(usuarioBuscado.password != password) {
        throw new UsuarioWrongPassword(username)
      }
      return {
          username : usuarioBuscado.username,
          tipo : usuarioBuscado.tipoUsuario
        }
    })
  }

  /************************** CONSULTAR EL HISTORIAL DE UN USUARIO **************************/

  consultarHistorial(id, usuario) {
    return pedidoService.consultarHistorial(id, usuario)
  }

  consultarTiendas() {
    return usuarioRepository.findTiendas()
    }

  
}

export default new UsuarioService()
