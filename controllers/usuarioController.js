import UsuarioService from "../services/usuarioService.js"
import { toUsuarioDTO } from "../converters/usuarioConverter.js"
import { usuarioValidator } from "../validators/usuarioValidator.js"
import { idValidator } from "../validators/idValidator.js"

class UsuarioController {

  crearUsuario(req, res) {
    const body = usuarioValidator.parse(req.body)
    const usuario = toUsuarioDTO(body)

    return UsuarioService.crearUsuario(usuario)
    .then((nuevoUsuario) => {
      return res.status(201).json(nuevoUsuario)
    })
  }

  verUsuario(req, res) {
    const id = idValidator.parse(req.params.id)

    return UsuarioService.buscar(id) 
    .then((usuario) => {
      res.status(200).json(usuario)
    })
  }

  verHistorialUsuario(req, res) {
    const id = idValidator.parse(req.params.id)

    return UsuarioService.consultarHistorial(id)
    .then((pedidos) => {
      res.status(200).json(pedidos)
    })
  }
}

export default new UsuarioController(UsuarioService)