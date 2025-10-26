import { Usuario } from "./usuario.js";


export class Vendedor extends Usuario {
    constructor(username, nombre, email, telefono, tipoUsuario, tienda){
        super (username, nombre, email, telefono, tipoUsuario)
        this.tienda = tienda
    }
}