    import mongoose, { Collection } from 'mongoose'
    import { Notificacion } from '../entities/notificacion'    
    
    const notificacionSchema = new mongoose.Schema({
        usuarioDestino : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Usuario',
            required : true
        },
        mensaje : {
            type : String,
            required : true
        },
        leida : {
            type : Boolean,
            required : true
        },
        fechaAlta : {
            type : Date,
            required : true
        },
       fechaLeida : {
            type : Date
        }
    },{
        timestamps : true,
        collection : 'notificaciones'
    })  

    usuarioSchema.loadClass(Notificacion)

    export const PedidoModel = mongoose.model('Notificacion', notificacionSchema)