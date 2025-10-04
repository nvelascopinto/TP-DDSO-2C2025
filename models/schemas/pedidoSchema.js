    import mongoose, { Collection } from 'mongoose'
    import { Pedido } from '../entities/pedido.js'  
    import { cambioEstadoSchema } from './cambioEstadoSchema.js'    
    const pedidoSchema = new mongoose.Schema({
        comprador : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Usuario',
            required : true
        },
        vendedor : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Usuario',
            required : true
        },
        items : {
            type : [mongoose.Schema.Types.ObjectId],
            ref : 'Item',
            required : true
        },
        total : {
            type : Number,
            min : 0,
            required : true
        },
        moneda : {
            type : String,
            enum : ["PESO_ARG", "DOLAR_USA", "REAL"],
            required : true
        },
        estado : {
            type : String,
            enum : ["Pendiente", "Confirmado", "En_Preparacion", "Enviado", "Entregado", "Cancelado"],
            required : true
        },
        direccionEntrega : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Direccion',
            required : true
            
        },
        historialCambioPedidos : {
           type : [cambioEstadoSchema]
        },
        fechaCreacion : {
            type : Date,
            required : true
        }

    },{
        timestamps : true,
        collection : 'pedidos'
    })  

    usuarioSchema.loadClass(Pedido)

    export const PedidoModel = mongoose.model('Pedido', pedidoSchema)