import { UsuarioSinPermisoError } from "../../errors/authorizationError.js";
import { CambioEstadoInvalidoError } from "../../errors/conflicError.js";
import { YaEnEstadoError } from "../../errors/conflicError.js";

export class Estado {
    constructor(estadosValidos, permitidosAEstado, nombre) {
        this.estadosValidos = estadosValidos;
        this.permitidosAEstado = permitidosAEstado;
        this.nombre = nombre;
    }

    validarCambiarAEstado(nuevoEstado, usuario, pedido) {
        if(pedido.estado == nuevoEstado) {
            throw new YaEnEstadoError(pedido._id, nuevoEstado.nombre);
        }
        if(!this.estadosValidos.includes(nuevoEstado)) {
            throw new CambioEstadoInvalidoError(pedido._id, pedido.estado.nombre, nuevoEstado.nombre);
        }
    }

    validarUsuario(usuario) {
        if(!this.permitidosAEstado.includes(usuario.tipoUsuario)) {
            throw new UsuarioSinPermisoError(usuario.tipoUsuario);
        }
    }

    cambiarEstadoA(nuevoEstado, usuario, pedido) {
        this.validarCambiarAEstado(nuevoEstado, usuario, pedido);
        pedido.estado = nuevoEstado;
        nuevoEstado.accionPostCambio(pedido);
    }

    accionPostCambio(pedido) {
        // Implementar en subclases si es necesario
    }

}
