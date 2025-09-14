
export function productoErrorHandler(error, req, res, next) {

    console.log(error.message);
    switch (error.name) {

        
        default:
            res.status(500).json({error : "Algo salio mal en el Servidor"})
            return
        }    
        
}