import TiendaRepository from "../models/repositories/tiendaRepository.js"
import { idValidator } from "../validators/idValidator.js"
import { ZodValidationError } from "../errors/validationError.js"
import {TiendaInexistenteError} from "../errors/notFoundError.js"

export class TiendaService{
    getTiendas(){
        return TiendaRepository.getTiendas()
    
    }

    getTiendaByName(tiendaNombre){
    return TiendaRepository.findByName(tiendaNombre)
      .then((tienda) => {
        if (!tienda) throw new TiendaInexistenteError(tiendaNombre);
        return tienda;
      });
  }
}