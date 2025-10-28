import { Usuario } from "./usuario.js";


export class Vendedor extends Usuario {
    constructor(username, password, nombre, email, telefono, tipoUsuario, tienda){
        super (username, password, nombre, email, telefono, tipoUsuario)
        this.tienda = tienda
    }
}