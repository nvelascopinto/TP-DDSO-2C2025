import UsuarioRepository from "../models/repositories/usuarioRepository.js"
import PedidoRepository from "../models/repositories/pedidoRepository.js"
// import PedidoService from "./pedidoService.js";
import { Usuario } from "../models/entities/usuario.js"
import { validarExistenciaDeUsuario } from "../validators/usuarioValidator.js"

class UsuarioService {
  constructor(usuarioRepository, pedidoRepository) {
    this.usuarioRepository = usuarioRepository
    this.pedidoRepository = pedidoRepository
    //this.pedidoService = pedidoService;
  }

  /************************** "VALIDAR" UN USUARIO **************************/
  obtenerUsuario(id, roles) {
    const user = this.usuarioRepository.findById(id)
    validarExistenciaDeUsuario(user, id)

    user.validarRol(roles)

    return user
  }

  /************************** CREAR UN USUARIO **************************/
  crearUsuario(usuarioResult) {
    const nuevoUsuario = new Usuario(
      usuarioResult.nombre,
      usuarioResult.email,
      usuarioResult.telefono,
      usuarioResult.tipoUsuario,
    )

    return this.usuarioRepository.crear(nuevoUsuario)
  }

  /************************** CONSULTAR UN USUARIO **************************/
  buscar(id) {
    const usuario = this.usuarioRepository.findById(id)
    validarExistenciaDeUsuario(usuario, id)

    return usuario
  }

  /************************** CONSULTAR EL HISTORIAL DE UN USUARIO **************************/

  // TODO: Solucionar dependencia circular entre servicios: pedidos y usuarios
  consultarHistorial(id) {
    const historial = this.pedidoRepository.consultarHistorial(id)
    return historial
  }
}

export default new UsuarioService(UsuarioRepository, PedidoRepository)
