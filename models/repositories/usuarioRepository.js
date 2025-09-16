export class UsuarioRepository {
    constructor(){
        this.usuarios=[]
        this.nextId = 1
    }

    crear(usuario){
        usuario.id = this.nextId++;
        this.usuarios.push(usuario)
        return usuario
    }

    

    findById(id) {
        return this.usuarios.find(u => u.id === id) || null
    }
}