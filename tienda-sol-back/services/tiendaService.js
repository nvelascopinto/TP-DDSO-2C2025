import usuarioService from "./usuarioService.js"
import { fromTiendaDTO } from "../converters/tiendaConverter.js"
import { idValidator } from "../validators/idValidator.js"
import { ZodValidationError } from "../errors/validationError.js"
import {TiendaInexistenteError} from "../errors/notFoundError.js"
import tiendaRepository from "../models/repositories/tiendaRepository.js"

class TiendaService{
  crearTienda(usuarioDTO) {
    return Promise.resolve()
      .then(() => {
        return fromTiendaDTO(usuarioDTO)
      })
      .then((nuevaTienda) => {
        if (!nuevaTienda) return Promise.resolve() // Si no ingresó una tienda, no hago nada
        return tiendaRepository.crear(nuevaTienda) 
      })
  }

  getTiendas(){
    return tiendaRepository.getTiendas()
  }

  getTiendaByName(username){
    return tiendaRepository.getTiendaByUsername(username)
    .then((tiendaBuscada) => {
      if (!tiendaBuscada) throw new TiendaInexistenteError(tiendaBuscada)
      return tiendaBuscada
    })
  }
}

export default new TiendaService()