import usuarioRepository from "../models/repositories/usuarioRepository.js"
import DatosInvalidosError from "../errors/datosInvalidosError.js"
export const authenticateUser = (fieldName) => (req, _res, next) => {
  Promise.resolve().then(()=> {
    //header X-User
    const idUser = req.get(fieldName) || req.body[fieldName] || req.params[fieldName] || req.query[fieldName];
    if(idUser == null) {
      throw new DatosInvalidosError("Username es requerido")
    }
    if(fieldName == "X-User") {
      fieldName = "user"
    }
    return usuarioRepository.findById(idUser)
  }).then((user) => { 
        req[fieldName] = user
        next() 
  }).catch(next)
 
}
