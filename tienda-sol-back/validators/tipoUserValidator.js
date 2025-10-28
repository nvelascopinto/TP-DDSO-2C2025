
import { tipoUsuario } from "../models/entities/tipoUsuario.js"
import { UsuarioInvalidoError } from "../errors/domainValidationError.js"
export function tipoUserValidator (tipo) {
if (!Object.values(tipoUsuario).includes(tipo)) {
          throw new UsuarioInvalidoError(tipo)
}
}