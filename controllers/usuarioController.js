import UsuarioService from "../services/usuarioService.js"
import { convertJSONtoUsuario } from "../conversores/conversoresUsuario.js"
import usuarioValidator from "../validators/usuarioValidator.js"
import idValidator from "../validators/idValidator.js"

class UsuarioController {
  constructor(usuarioService) {
    this.usuarioService = usuarioService
  }

  crearUsuario(req, res) {
    const body = usuarioValidator.parse(req.body)
    const usuario = convertJSONtoUsuario(body)

    const nuevoUsuario = this.usuarioService.crearUsuario(usuario)

    return res.status(201).json(nuevoUsuario)
  }

  verUsuario(req, res) {
    const id = idValidator.parse(req.params.id)

    const usuario = this.usuarioService.buscar(id)

    return res.status(200).json(usuario)
  }

  verHistorialUsuario(req, res) {
    const id = idValidator.parse(req.params.id)

    const pedido = this.usuarioService.consultarHistorial(id)

    return res.status(200).json(pedido)
  }
}

export default new UsuarioController(UsuarioService)
