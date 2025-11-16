import { YaExisteUsuarioError } from "../../errors/conflicError.js"
import { UsuarioModel } from "../schemas/usuarioSchema.js"
class UsuarioRepository {
  constructor() {
    this.model = UsuarioModel
  }

  crear(usuario) {
    const nuevoUsuario = new this.model(usuario)
    return nuevoUsuario.save()
      .catch((error) => {
        if (error.code == 11000){
           throw new YaExisteUsuarioError(usuario.username)
        }
        throw error
      })
  }

  findById(id) {
    return this.model.findOne({username : id})
  }

  update(notificacion) {
    return this.model.findByIdAndUpdate(notificacion._id, notificacion, {
      new: true
    })
  }
}

export default new UsuarioRepository()
