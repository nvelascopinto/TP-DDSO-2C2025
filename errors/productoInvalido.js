export class ProductoInvalido extends Error {
    constructor(message){
        super();
        this.name = "UsuarioInexistenteError";
        this.message = message
    }
}