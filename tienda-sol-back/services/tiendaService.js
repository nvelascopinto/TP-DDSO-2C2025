import usuarioService from "./usuarioService.js"
import { idValidator } from "../validators/idValidator.js"
import { ZodValidationError } from "../errors/validationError.js"
import {TiendaInexistenteError} from "../errors/notFoundError.js"

class TiendaService{
    getTiendas(){
      return usuarioService.consultarTiendas()
    }

    getTiendaByName(tiendaNombre){
      return usuarioService.consultarTienda(tiendaNombre)
      .then((tiendaBuscada) => {
        if (!tiendaBuscada) throw new TiendaInexistenteError(tiendaBuscada)
        return tiendaBuscada
      })
    
  }
}

export default new TiendaService()