import sesionService from "../services/sesionService.js"
import {loginValidator} from "../validators/loginValidator.js"

class SesionController {
  login(req,res) {
    return Promise.resolve()
      .then(()=>{
        return loginValidator.parse(req.body)
        
      }).then((userData)=> {
        console.log("PASSWORD CON "+ userData.password)
        return sesionService.autenticarUser(userData.username, userData.password)
      }).then((usuarioObtenido) =>{
        res.status(200).json(usuarioObtenido)
      })
  }
}

export default new SesionController()