import { EstadoInvalidoError } from "../errors/domainValidationError.js";
import { estados } from "../models/entities/estadosPedido.js";

export function estadoConverter(estadoAConvertir) {
    if(!estados[estadoAConvertir]) {
        throw new EstadoInvalidoError(estadoAConvertir);
    }
    return estados[estadoAConvertir];
}
