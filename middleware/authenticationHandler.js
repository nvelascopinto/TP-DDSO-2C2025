import usuarioRepository from "../models/repositories/usuarioRepository.js"
import DatosInvalidosError from "../errors/datosInvalidosError.js"
import { validarExistenciaDeUsuario } from "../validators/usuarioValidator.js"
export const authenticateUser = (fieldName) => (req, _res, next) => {
  Promise.resolve()
    .then(() => {
      //header X-User
      const idUser =
        req.get(fieldName.toLowerCase()) || req.body[fieldName] || req.params[fieldName] || req.query[fieldName]
      if (idUser == null) {
        throw new DatosInvalidosError("Username es requerido")
      }

      return usuarioRepository.findById(idUser)
    })
    .then((user) => {
      validarExistenciaDeUsuario(user)
      let key = fieldName
      if (fieldName == "X-User") {
        key = "user"
      }
      console.log("KEYYY", key)
      req[key] = user
      next()
    })
    .catch(next)
}
