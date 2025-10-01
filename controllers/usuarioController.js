import UsuarioService from "../services/usuarioService.js";
import { convertJSONtoUsuario } from "../conversores/conversoresUsuario.js";
import { validarUsuario } from "../validadores/validadorUsuario.js";
import { validarId } from "../validadores/validadorID.js";

class UsuarioController {
  constructor(usuarioService) {
    this.usuarioService = usuarioService;
  }

  crearUsuario(req, res) {
    const body = validarUsuario(req.body);

    const usuario = convertJSONtoUsuario(body);

    const nuevoUsuario = this.usuarioService.crearUsuario(usuario);

    return res.status(201).json(nuevoUsuario);
  }

  verUsuario(req, res) {
    const id = validarId(req.params.id);

    const usuario = this.usuarioService.buscar(id);

    res.status(200).json(usuario);
  }

  verHistorialUsuario(req, res) {
    const id = validarId(req.params.id);

    const pedido = this.usuarioService.consultarHistorial(id);

    res.status(200).json(pedido);
  }
}

export default new UsuarioController(UsuarioService)