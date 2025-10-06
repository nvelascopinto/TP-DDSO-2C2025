import usuarioRepository from "../models/repositories/usuarioRepository.js"
import DatosInvalidosError from "../errors/datosInvalidosError.js"
export const authenticateUser = (fieldName) => (req, _res, next) => {
  Promise.resolve().then(()=> {
    const idUser = req.body[fieldName] || req.params[fieldName] || req.query[fieldName];
    if(idUser == null) {
      throw new DatosInvalidosError("Username es requerido")
    }
    return usuarioRepository.findById(idUser)
  }).then((user) => { 
        req[fieldName] = user
        next() 
  }).catch(next)
 
}
