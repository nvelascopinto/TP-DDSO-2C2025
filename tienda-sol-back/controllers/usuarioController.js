import usuarioService from "../services/usuarioService.js"
import { toUsuarioDTO } from "../converters/usuarioConverter.js"
import { usuarioValidator } from "../validators/usuarioValidator.js"
import { idValidator } from "../validators/idValidator.js"
import { ZodValidationError } from "../errors/validationError.js"
import {loginValidator }  from "../validators/loginValidator.js"

class UsuarioController {
  crearUsuario(req, res) {
    return Promise.resolve()
      .then(() => 
        {  

          return usuarioValidator.parse(req.body)}
      )
      .catch((e) => {
        throw new ZodValidationError(e)
      })        
      .then((bodyUsuario) => { 
        console.log(bodyUsuario)
        const usuario = toUsuarioDTO(bodyUsuario)
        return usuarioService.crearUsuario(usuario)
      })
      .then((nuevoUsuario) => {
        
        res.status(201).json(nuevoUsuario)
      })
  }

  verUsuario(req, res) {
    return Promise.resolve()
      .then(() => 
        idValidator.parse(req.params.id)
      )
      .catch((e) => {
        throw new ZodValidationError(e)
      })     
      .then((idUsuario) =>
        usuarioService.buscar(idUsuario)
      )
      .then((usuario) =>
        res.status(200).json(usuario)
      )
  }

  verHistorialUsuario(req, res) {
    return Promise.resolve()
      .then(() => 
        idValidator.parse(req.params.id)
      )
      .catch((e) => {
        throw new ZodValidationError(e)
      })    
      .then((idUsuario) => 
        usuarioService.consultarHistorial(idUsuario, req.user)
      )
      .then((pedidos) =>
        res.status(200).json(pedidos)
      )
  }

  verTiendas(req, res) {
    return Promise.resolve()
      .then(() => 
        usuarioService.consultarTiendas()
      )
      .then((tiendas) =>
        res.status(200).json(tiendas)
      )
  }
}

export default new UsuarioController()
