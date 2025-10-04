import { UsuarioModel } from "../schemas/usuarioSchema.js"
class UsuarioRepository {
  constructor() {
    this.model = UsuarioModel
  }

  crear(usuario) {
    const nuevoUsuario = new this.model(usuario)
    return nuevoUsuario.save()
  }

  findById(id) {
    return this.model.findById(id)
  }
}

export default new UsuarioRepository()
