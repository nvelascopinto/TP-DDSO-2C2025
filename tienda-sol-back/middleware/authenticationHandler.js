import usuarioRepository from "../models/repositories/usuarioRepository.js"
import { ValidationError } from "../errors/validationError.js"
import { UsuarioInexistenteError } from "../errors/notFoundError.js"

export const authenticateUser = (fieldName) => (req, _res, next) => {
  Promise.resolve()
    .then(() => {
      //header X-User
      const fieldNameLC = fieldName.toLowerCase()
      const idUser = req.get(fieldNameLC) || req.params?.[fieldName] || req.query?.[fieldName]
      if (idUser == null) {
        throw new ValidationError("Username es requerido")
      }

      return usuarioRepository.findById(idUser)
    })
    .then((user) => {
      if (!user) throw new UsuarioInexistenteError(user)
      let key = fieldName
      if (fieldName == "X-User") {
        key = "user"
      }
      req[key] = user
      next()
    })
    .catch(next)
}
