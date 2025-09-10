import { pedidoRepository } from "../models/repositories/pedidoRepository.js";
import {estado} from "../models/entities/estadoPedido.js"
import express from "express"

export class PedidoService {

    constructor() {
        this.pedidoRepository = pedidoRepository
    }
    
    crear(nuevoPedidoJSON) {
        const nuevoPedido = new Pedido(
            nuevoPedidoJSON.comprador,
            nuevoPedidoJSON.items,
            nuevoPedidoJSON.total,
            nuevoPedidoJSON.moneda,
            nuevoPedidoJSON.direccionEntrega
        )

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
        return pedido
    }

    pedidoEsValido(id){
        const pedido = this.pedidoRepository.findByID(id)

        return pedido
    }
    
    usuarioEsValido(id){
        const usuario = this.usuarioRepository.findByID(id)
        if(usuario !== null) {
            throw new UsuarioInexistenteError("No existe el usuario con el id enviado")
        }
        return true
        // capaz es necesario chequear que si el user es comprador, que sea el que 
        // compró el pedido, y si es vendedor que sea vendedor de ese pedido
    }

        
    pedidoYaEnviado(pedido){
        if (pedido.estado === estado.ENVIADO) {
            throw new PedidoInexistenteError("Este pedido ya fue enviado y no puede ser cancelado")
        }
        return
    }
    
}

class UsuarioInexistenteError extends Error {
  constructor(message) {
    super(message);
    this.name = "UsuarioInexistenteError";
  
}}

class PedidoInexistenteError extends Error {
  constructor(message) {
    super(message);
    this.name = "PedidoInexistenteError";
  
}}