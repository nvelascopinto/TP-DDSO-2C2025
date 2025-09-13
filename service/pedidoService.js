import { pedidoRepository } from "../models/repositories/pedidoRepository.js";
import {estado} from "../models/entities/estadoPedido.js"
import { UsuarioInexistenteError } from "../errors/usuarioInexistenteError.js";
import { PedidoInexistenteError } from "../errors/pedidoInexistenteError.js";
import express from "express"

export class PedidoService {

    constructor() {
        this.pedidoRepository = pedidoRepository
    }
    
    crear(nuevoPedido) {
       
        // hacer chequeo de tipos ver si con zod o de otra forma. 
        const stockValido = nuevoPedido.validarStock()

        if(!stockValido){
            return null
        }
        
        const pedidoGuardado = this.pedidoRepository.crear(nuevoPedido)

        return pedidoGuardado
    }

    cancelar(cambioEstadoJSON, idPedido) {
        usuarioEsValido(cambioEstadoJSON.idUsuario)
        pedido = pedidoEsValido(idPedido)
        pedidoYaEnviado(pedido)
        pedido.actualizarEstado(estado.CANCELADO,cambioEstadoJSON.idUsuario, cambioEstadoJSON.motivo)
    }

    consultar(id) {
        const pedido = this.pedidoRepository.consultar(id)
        if (pedido == null) {
            throw new PedidoInexistenteError(id)
        }
        return pedido
    }

    pedidoEsValido(id){
        const pedido = this.pedidoRepository.findByID(id)

        return pedido
    }
    
    usuarioEsValido(id){
        const usuario = this.usuarioRepository.findByID(id)
        if(usuario !== null) {
            throw new UsuarioInexistenteError(id)
        }
        return true
    }

        
    pedidoYaEnviado(pedido){
        if (pedido.estado === estado.ENVIADO) {
            throw new PedidoInexistenteError(pedido.id)
        }
        return
    }
    
}



