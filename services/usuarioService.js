import UsuarioRepository from "../models/repositories/usuarioRepository.js";
import PedidoRepository from "../models/repositories/pedidoRepository.js";
// import PedidoService from "./pedidoService.js";
import { UsuarioInexistenteError } from "../errors/usuarioInexistenteError.js";
import { UsuarioSinPermiso } from "../errors/usuarioSinPermisos.js";
import { DatosInvalidos } from "../errors/datosInvalidos.js";
import { tipoUsuarioValidator } from "../validadores/validadorTipoUsuario.js";
import { Usuario } from "../models/entities/usuario.js";
import pedidoRepository from "../models/repositories/pedidoRepository.js";

class UsuarioService {
  constructor(usuarioRepository, pedidoRepository ) {
    this.usuarioRepository = usuarioRepository;
    this.pedidoRepository = pedidoRepository
    //this.pedidoService = pedidoService;
  }

  obtenerUsuario(id, roles) {
    const user = this.usuarioRepository.findById(id);

    if (user == null) {
      throw new UsuarioInexistenteError(id);
    }

    if (!roles.includes(user.tipoUsuario)) {
      throw new UsuarioSinPermiso(id);
    }

    return user;
  }

  crearUsuario(usuarioResult) {
    const tipoUser = tipoUsuarioValidator(usuarioResult.tipoUsuario);

    if (tipoUser == null) {
      throw new DatosInvalidos("El tipo de usuario no es valido");
    }

    let nuevoUsuario = new Usuario(
      usuarioResult.nombre,
      usuarioResult.email,
      usuarioResult.telefono,
      usuarioResult.tipoUsuario,
    );

    return this.usuarioRepository.crear(nuevoUsuario);
  }

  buscar(id) {
    const usuario = this.usuarioRepository.findById(id);

    if (!usuario) {
      throw new UsuarioInexistenteError(id);
    }

    return usuario;
  }

  // TODO: Solucionar dependencia circular entre servicios: pedidos y usuarios
  consultarHistorial(id) {
    const historial = this.pedidoRepository.consultarHistorial(id);
    return historial;
  }
}

export default new UsuarioService(UsuarioRepository, PedidoRepository)