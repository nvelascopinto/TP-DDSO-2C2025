import usuarioServiceInstance from "../services/usuarioService.js"
import { toUsuarioDTO } from "../converters/usuarioConverter.js"
import { usuarioValidator } from "../validators/usuarioValidator.js"
import { idValidator } from "../validators/idValidator.js"

class UsuarioController {
  crearUsuario(req, res) {
    return Promise.resolve()
      .then(() => {
        const body = usuarioValidator.parse(req.body)
        const usuario = toUsuarioDTO(body)

        return usuarioServiceInstance.crearUsuario(usuario)
      })
      .then((nuevoUsuario) => {
        return res.status(201).json(nuevoUsuario)
      })
  }

  verUsuario(req, res) {
    return Promise.resolve()
      .then(() => {
        const id = idValidator.parse(req.params.id)
        return usuarioServiceInstance.buscar(id)
      })
      .then((usuario) => {
        res.status(200).json(usuario)
      })
  }

  verHistorialUsuario(req, res) {
    return Promise.resolve()
      .then(() => {
        const id = idValidator.parse(req.params.id)
        return usuarioServiceInstance.consultarHistorial(id)
      })
      .then((pedidos) => {
        res.status(200).json(pedidos)
      })
  }
}

export default new UsuarioController(usuarioServiceInstance)
