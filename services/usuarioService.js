import { UsuarioInexistenteError } from "../errors/usuarioInexistenteError.js";
import { UsuarioSinPermiso } from "../errors/usuarioSinPermisos.js";
import { DatosInvalidos } from "../errors/datosInvalidos.js";
import { tipoUsuarioValidator } from "../validadores/validadorTipoUsuario.js";
import { Usuario } from "../models/entities/usuario.js";

export class UsuarioService {
  constructor(usuarioRepository, pedidoService) {
    this.usuarioRepository = usuarioRepository;
    this.pedidoService = pedidoService;
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

  notificar(notificacion) {
    const destinatario = this.buscar(notificacion.usuarioDestino);

    destinatario.agregarNotificacion(notificacion);
  }

  // TODO: Solucionar dependencia circular entre servicios: pedidos y usuarios
  consultarHistorial(id) {
    const historial = this.pedidoService.consultarHistorial(id);
    return historial;
  }
}
