    import mongoose, { Collection } from 'mongoose'
    import { ItemPedido } from '../entities/itemPedido'    
    const itemSchema = new mongoose.Schema({
        producto : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Producto',
            required : true
        },
        cantidad : {
            type : Number,
            min : 0,
            required : true
        },
        precioUnitario: {
            type : Number,
            min : 0,
            required : true
        }
    },{
        timestamps : true,
        collection : 'items'
    })  

    usuarioSchema.loadClass(ItemPedido)

    export const ProductoModel = mongoose.model('Item', itemSchema)