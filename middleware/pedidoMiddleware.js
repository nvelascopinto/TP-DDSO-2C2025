import { UsuarioInexistenteError } from "../errors/usuarioInexistenteError.js";
import { PedidoInexistenteError } from "../errors/pedidoInexistenteError.js";
import {YaEnEstadoError} from  "../errors/yaEnEstadoError.js";
export function pedidosErrorHandler(error, _req, res, _next) {
    console.log(error.message);

    switch (error.name) {
        case UsuarioInexistenteError.name:
            res.status(401).json({
                message: error.message
            })
            return
        case PedidoInexistenteError.name:
            res.status(404).json({
                message: error.message
            })
            return
        case YaEnEstadoError.name:
            res.status(409).json({
                message: error.message
            })
            return
        default:
            res.status(500).json({error : "Algo salio mal en el Servidor"})
            return
}}