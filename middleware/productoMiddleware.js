import { ProductoInvalido } from "../errors/productoInvalido.js"

export function productoErrorHandler(error, req, res, next) {

    console.log(error.message);
    switch (error.name) {

        case ProductoInvalido.name:
            res.status(400).json({
                message: error.message
            })
            return
        default:
            res.status(500).json({error : "Algo salio mal en el Servidor"})
            return
        }    
        
}