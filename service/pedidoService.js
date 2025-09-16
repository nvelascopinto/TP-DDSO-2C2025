import { pedidoRepository } from "../models/repositories/pedidoRepository.js";
import {autorizadosAEstado, estado} from "../models/entities/estadoPedido.js"
import {ordenEstados} from "../models/entities/estadoPedido.js"
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
import { CambioEstadoInvalidoError } from "../errors/cambioEstadoInvalidoError.js";
import { YaEnEstadoError } from "../errors/yaEnEstadoError.js";
import { HistorialInexistenteError } from "../errors/historialInexistenteError.js";
export class PedidoService {

    constructor(pedidoRepository, usuarioService, productoRepository) {
        this.pedidoRepository = pedidoRepository
        this.usuarioService  = usuarioService
        this.productoRepository  = productoRepository
    }
    
    crear(pedidoDTO) {
        
        const nuevoPedido = this.convertirAPedido(pedidoDTO)
      
        const stockValido = nuevoPedido.validarStock()

        if(stockValido === false){
            throw new pedidoStockInsuficiente()
        }
        
        const pedidoGuardado = this.pedidoRepository.crear(nuevoPedido)

        return pedidoGuardado
    }

    convertirAPedido (pedidoDTO) {
        const comprador =  this.usuarioService.obtenerUsuario(pedidoDTO.compradorID, [tipoUsuario.COMPRADOR])
        const vendedor = this.usuarioService.obtenerUsuario(pedidoDTO.vendedorID, [tipoUsuario.VENDEDOR])
        const items = pedidoDTO.itemsDTO.map(item =>{
            const it = this.convertirAItem(item)
            return it
        } )
        if (!items.every(item => item.producto.vendedor.id === vendedor.id)) {
            throw new DatosInvalidos("Los productos del pedido deben ser todos del mismo vendedor")
        }
        const moneda = monedaValidator(pedidoDTO.moneda)
        if (!moneda) {
            throw new PedidoDatosInvalidosInvalido("La moneda ingresada no esta dentro de las opciones ofrecidas")
        }

        const direEntrega = this.convertirADireccion(pedidoDTO.direccionEntregaDTO)
        console.log("DIRECCION ENTREGA CONVERTIDA", direEntrega)
        return new Pedido(comprador, vendedor, items, moneda, direEntrega)
    }

    convertirADireccion(direDTO){
      
        const direRe = direccionSchema.safeParse(direDTO)
        
        if(!direRe.success) {
            
            throw new DatosInvalidos(direRe.error.issues[0].message)
        
        }
        const direResult = direDTO
        return new direccionEntrega(direResult.calle, direResult.altura, direResult.piso, direResult.departamento, direResult.codigoPostal, direResult.ciudad, direResult.provincia, direResult.pais, direResult.latitud, direResult.longitud)
    }
    
    convertirAItem(itemDTO) {
       
        const itemResult = itemSchema.safeParse(itemDTO)
        if(!itemResult.success) {
            throw new DatosInvalidos(itemResult.error.issues[0].message)
        }
        const producto = this.productoRepository.findById(itemDTO.productoID)
        if(!producto) {
            throw new ProductoInexistente(itemDTO.productoID)
        }
        return new itemPedido(producto,itemDTO.cantidad, itemDTO.precioUnitario)
    }

    cancelar(cambioEstadoJSON, idPedido) {
        const pedido = this.consultar(idPedido)
         const valido =this.usuarioEsValidoCompra(cambioEstadoJSON.idUsuario, pedido)
       
      
        if(valido === false) {
            throw new UsuarioSinPermiso(cambioEstadoJSON.idUsuario)
        }

        this.esValidoCambioEstado(estado.CANCELADO,pedido.estado)
        pedido.actualizarEstado(estado.CANCELADO,cambioEstadoJSON.idUsuario, cambioEstadoJSON.motivo)
        return pedido 
    }

    marcarEnviado(idVendedor, idPedido) {
        this.usuarioService.obtenerUsuario(idVendedor, [tipoUsuario.VENDEDOR])
        const pedido = this.consultar(idPedido)
        this.esValidoCambioEstado(estado.ENVIADO, pedido.estado)
        pedido.actualizarEstado(estado.ENVIADO,idVendedor, "Envio del pedido")
    }
    consultar(id) {
        const pedido = this.pedidoRepository.consultar(id)
        if (pedido == null) {
            throw new PedidoInexistenteError(id)
        }
    
        return pedido
    }

    usuarioEsValidoCompra(id, pedido) {
        usuario = this.usuarioService.obtenerUsuario(id, [tipoUsuario.COMPRADOR, tipoUsuario.VENDEDOR, tipoUsuario.ADMIN])
        
        return (pedido.comprador.id == usuario.id || pedido.vendedor.id == usuario.id || usuario.tipoUsuario === "Admin")
    }
    usuarioEsValido(id) {
        usuario = this.usuarioService.obtenerUsuario(id, [tipoUsuario.COMPRADOR, tipoUsuario.VENDEDOR, tipoUsuario.ADMIN])
        
        return true
    }

    usuarioEstaAutorizado(id, roles) {
        const usuario = this.usuarioService.obtenerUsuario(id, roles )
        if(usuario == null) {
            throw new UsuarioInexistenteError(id)
        }
        return true
    }

   consultarHistorial(id) {
        if (this.usuarioEsValido(id)) { 
           const historialPedidos = this.pedidoRepository.consultarHistorial(id)
           if(historialPedidos.length == 0) {
             throw new HistorialInexistenteError(id)
           }
           return historialPedidos
        }
    }
    
    esValidoCambioEstado(nuevoEstado, estadoActual){
       
        const indiceEstadoActual = ordenEstados.indexOf(estadoActual);
        const indiceEstadoNuevo = ordenEstados.indexOf(nuevoEstado);

        if(indiceEstadoNuevo == indiceEstadoActual) {
            throw new YaEnEstadoError(nuevoEstado)
           }
        if(indiceEstadoNuevo < indiceEstadoActual ||  estadoActual == estado.CANCELADO) {
             throw new CambioEstadoInvalidoError(estadoActual,nuevoEstado)
           }
        return true
        }

    cambioEstado(cambioEstado, idPedido) {
        
        this.usuarioEstaAutorizado(cambioEstado.idUsuario, autorizadosAEstado[cambioEstado.estado])
        const pedido = this.consultar(idPedido)
        this.esValidoCambioEstado(estado[cambioEstado.estado],pedido.estado)
        pedido.actualizarEstado(estado[cambioEstado.estado],cambioEstado.idUsuario, cambioEstado.motivo)
    }
}