import UsuarioRepository from "../models/repositories/usuarioRepository.js"
//import PedidoRepository from "../models/repositories/pedidoRepository.js"
import pedidoService from "./pedidoService.js"
// import PedidoService from "./pedidoService.js";
import { Usuario } from "../models/entities/usuario.js"
import { validarExistenciaDeUsuario } from "../validators/usuarioValidator.js"

class UsuarioService {
  constructor(usuarioRepository, pedidoService) {
    this.usuarioRepository = usuarioRepository
    this.pedidoService = pedidoService
    //this.pedidoService = pedidoService;
  } 

  /************************** "VALIDAR" UN USUARIO **************************/
  obtenerUsuario(id, roles) {
    const user = this.usuarioRepository.findById(id)
    validarExistenciaDeUsuario(user, id)

    user.validarRol(roles)

    return user
  } // falta manejo de promises depsues de ver que hacemos con lo del authorization 

  /************************** CREAR UN USUARIO **************************/
  crearUsuario(usuarioResult) {
    const nuevoUsuario = new Usuario(
      usuarioResult.nombre,
      usuarioResult.email,
      usuarioResult.telefono,
      usuarioResult.tipoUsuario,
    )

    return this.usuarioRepository.crear(nuevoUsuario).then((creado) => creado)
  }

  /************************** CONSULTAR UN USUARIO **************************/
  buscar(id) {
    const usuario = this.usuarioRepository.findById(id).then((usuarioBuscado) => usuarioBuscado)
    //validarExistenciaDeUsuario(usuario, id)

    return usuario
  }

  /************************** CONSULTAR EL HISTORIAL DE UN USUARIO **************************/

  // TODO: Solucionar dependencia circular entre servicios: pedidos y usuarios
  consultarHistorial(id) {
    return this.pedidoService.consultarHistorial(id).then((historial)=> historial)
  }
}

export default new UsuarioService(UsuarioRepository, PedidoRepository)
