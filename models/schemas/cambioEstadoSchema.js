    import mongoose, { Collection } from 'mongoose'
    import { CambioEstadoPedido } from '../entities/cambioEstadoPedido'
    export const cambioEstadoSchema = new mongoose.Schema({
        fecha : {
            type : Date,
            required : true
        },
        estado : {
            type : String,
            enum : ["Pendiente", "Confirmado", "En_Preparacion", "Enviado", "Entregado", "Cancelado"],
            required : true
        },
        pedido : { 
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Pedido',
            required : true
        },
        usuario : { 
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Usuario',
            required : true
        },
        motivo : {
            type : String
        }
    })  

   