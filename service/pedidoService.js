import { pedidoRepository } from "../models/repositories/pedidoRepository.js";
import {estado} from "../models/entities/estadoPedido.js"
import { UsuarioInexistenteError } from "../errors/usuarioInexistenteError.js";
import { PedidoInexistenteError } from "../errors/pedidoInexistenteError.js";
import { pedidoStockInsuficiente } from "../errors/pedidoStockInsuficiente.js";
import { Pedido } from "../models/entities/pedido.js";
import { direccionEntrega } from "../models/entities/direccionEntrega.js";
import { tipoUsuario } from "../models/entities/tipoUsuario.js";
import { UsuarioSinPermiso } from "../errors/usuarioSinPermisos.js";
import { itemPedido } from "../models/entities/itemPedido.js";
import { itemSchema } from "../validadores/itemSchema.js";
import { ProductoInexistente } from "../errors/productoInexistente.js";
import { monedaValidator } from "../validadores/validadorMoneda.js";
import { direccionSchema } from "../validadores/validadorDireccion.js";
import { DatosInvalidos } from "../errors/datosInvalidos.js";
export class PedidoService {

    constructor(pedidoRepository, usuarioService, productoRepository) {
        this.pedidoRepository = pedidoRepository
        this.usuarioService  = usuarioService
        this.productoRepository  = productoRepository
    }
    
    crear(pedidoDTO) {
        
        const nuevoPedido = this.convertirAPedido(pedidoDTO)
      
        const stockValido = nuevoPedido.validarStock()

        if(!stockValido){
            throw new pedidoStockInsuficiente(id)
        }
        
        const pedidoGuardado = this.pedidoRepository.crear(nuevoPedido)

        return pedidoGuardado
    }

    convertirAPedido (pedidoDTO) {
        const comprador =  this.usuarioService.obtenerUsuario(pedidoDTO.compradorID, [tipoUsuario.COMPRADOR])
        const vendedor = this.usuarioService.obtenerUsuario(pedidoDTO.vendedorID, [tipoUsuario.VENDEDOR])

        const items = pedidoDTO.itemsDTO.map(item => this.convertirAItem(item))
        if (items.every(item => item.vendedor.id === vendedor.id)) {
            throw new DatosInvalidos("Los productos del pedido deben ser todos del mismo vendedor")
        }
        const moneda = monedaValidator(pedidoDTO.moneda)
        if (!moneda) {
            throw new PedidoDatosInvalidosInvalido("La moneda ingresada no esta dentro de las opciones ofrecidas")
        }

        const direccion = this.convertirADireccion(pedidoDTO.direccionEntregaDTO)
        return new Pedido(comprador, vendedor, items, moneda, direEntrega)
    }
    convertirADireccion(direDTO){
        const direRe = direccionSchema.safeParce(direDTO)

        if(!direRe.success) {
            
            throw new DatosInvalidos(direRe.error.issues[0].message)
        
        }
        direResult = direRe.data
        return new direccionEntrega(direResult.calle, direResult.altura, direResult.piso, direResult.departamento, direResult.codigoPostal, direResult.ciudad, direResult.provincia, direResult.pais, direResult.latitud, direResult.longitud)
    }
    convertirAItem(itemDTO) {
        const itemResult = itemSchema.safeParse(itemDTO)
        if(!itemResult.success) {
            throw new DatosInvalidos(itemResult.error.issues[0].message)
        }
        const producto = this.productoRepository.findById(itemResult.data.productoID)
        if(!producto) {
            throw new ProductoInexistente(itemResult.data.productoID)
        }
        return new itemPedido(producto,itemResult.data.cantidad, itemResult.data.precioUnitario)
    }

    cancelar(cambioEstadoJSON, idPedido) {
        this.usuarioEsValido(cambioEstadoJSON.idUsuario)
        const pedido = this.consultar(idPedido)
        this.pedidoYaEnviado(pedido)
        pedido.actualizarEstado(estado.CANCELADO,cambioEstadoJSON.idUsuario, cambioEstadoJSON.motivo)
    }

    consultar(id) {
        const pedido = this.pedidoRepository.consultar(id)
        if (pedido == null) {
            throw new PedidoInexistenteError(id)
        }
        return pedido
    }

    usuarioEsValido(id){
        const usuario = this.usuarioService.obtenerUsuario(id, [tipoUsuario.COMPRADOR, tipoUsuario.VENDEDOR, tipoUsuario.ADMIN])
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



