import { tipoUsuario } from "../models/entities/tipoUsuario.js"
import { UsuarioInexistenteError } from "../errors/usuarioInexistenteError.js"
import { UsuarioSinPermiso } from "../errors/usuarioSinPermisos.js"
import { usuarioSchema } from "../validadores/validadorUsuario.js"
import { DatosInvalidos } from "../errors/datosInvalidos.js"
import { tipoUsuarioValidator } from "../validadores/validadorTipoUsuario.js"
import { Usuario } from "../models/entities/usuario.js"
import { UsuarioRepository } from "../models/repositories/usuarioRepository.js"

export class UsuriosService { 
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository
    }
    obtenerUsuario(id, roles) {
        const user = this.usuarioRepository.findById(id)
        if(!user) {
            throw new UsuarioInexistenteError(id)
        }

        if(!roles.includes(tipoUsuario[user.tipoUsuario])) {
            throw new UsuarioSinPermiso(id)
        
        }
       
        return user
    }

    crearUsuario(usuarioResult) {
        
        const tipoUser = tipoUsuarioValidator(usuarioResult.tipoUsuario)
        
        if(tipoUser == null) {
         throw new DatosInvalidos("El tipo de usuario no es valido")
        }
        
        let nuevoUsuario =  new Usuario(usuarioResult.nombre, usuarioResult.email, usuarioResult.telefono, usuarioResult.tipoUsuario)
        console.log(nuevoUsuario)
        return this.usuarioRepository.crear(nuevoUsuario)

    }

    buscar(id) {
        const usuario = this.usuarioRepository.findById(id)

        if(!usuario) {
            throw new UsuarioInexistenteError(id)
        }

        return usuario
    }
 }
