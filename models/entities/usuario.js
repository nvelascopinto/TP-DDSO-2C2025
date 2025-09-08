export class usuario{
    consructor(nombre, email, telefono, tipoUsuario){
        this.nombre = nombre
        this.email = email
        this.telefono = telefono
        this.tipoUsuario = tipoUsuario
        this.fechaAlta = date()
    }
}