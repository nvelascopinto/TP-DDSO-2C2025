import { DatosInvalidos } from "../errors/datosInvalidos";
import { UsuarioInexistenteError } from "../errors/usuarioInexistenteError";
import { UsuarioSinPermiso } from "../errors/usuarioSinPermisos";
export function usuarioErrorHandler(error, req, res, next) {

    console.log(error.message);
    switch (error.name) {

        case UsuarioSinPermiso.name:
            res.status(403).json({
                message: error.message
            })
            return
        case UsuarioInexistenteError.name:
            res.status(401).json({
                message: error.message
            })
            return
        case DatosInvalidos.name :
            res.status(400).json({
                message: error.message
            })
            return
        default:
            res.status(500).json({error : "Algo salio mal en el Servidor"})
            return
        }    
        
}