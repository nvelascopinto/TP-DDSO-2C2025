import usuarioRepository from "../models/repositories/usuarioRepository.js"
import pedidoService from "./pedidoService.js"
import { fromUsuarioDTO } from "../converters/usuarioConverter.js"
import { UsuarioInexistenteError } from "../errors/notFoundError.js"
import { YaExisteUsuarioError } from "../errors/conflicError.js"
import { UsuarioWrongPassword } from "../errors/authorizationError.js"
import { create } from "domain"
import { UserDTO } from "../models/DTO/userDTO.js"
class UsuarioService {
  /************************** CREAR UN USUARIO **************************/
  crearUsuario(usuarioDTO) {
    return Promise.resolve()
      .then(() => {
         return fromUsuarioDTO(usuarioDTO)
      }).then((user)=>{
          return usuarioRepository.crear({ ...user })
        }).then((createdUser)=>{
        return new UserDTO(createdUser.username, createdUser.tipoUsuario)
      })
  }

  /************************** CONSULTAR UN USUARIO **************************/
  buscar(id) {
    return usuarioRepository.findById(id)
      .then((usuarioBuscado) => {
        console.log("USUARIO COMPLETO:", JSON.stringify(usuarioBuscado, null, 2))
      console.log("KEYS:", Object.keys(usuarioBuscado))
      console.log("PASSWORD:", usuarioBuscado.password)
        if (!usuarioBuscado) throw new UsuarioInexistenteError(id)
        return usuarioBuscado
      })
  }

  autenticarUser(username, password) {
    return this.buscar(username).then((usuarioBuscado)=>{
      console.log("PASSWORD"+ usuarioBuscado)
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
