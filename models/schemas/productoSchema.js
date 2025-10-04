    import mongoose, { Collection } from 'mongoose'
    import { Producto } from '../entities/producto'
import { required } from 'zod/mini'
    
    const productoSchema = new mongoose.Schema({
        vendedor : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Usuario',
            required : true
        },
        titulo : {
            type :String,
            required : true,
        },
        descripcion : { 
            type :String,
        },
        descripcion : { 
            type :String,
            required : true,
        },
        precio : {
            type : Number,
            min : 0,
            required : true
        },
        moneda : {
            type : String,
            enum : ["PESO_ARG", "DOLAR_USA", "REAL"],
            required : true
        },
        stock : {
            type : Number,
            required : true,
            min : 0
        },
        fotos : {
            type : [String], 
            required : false,
        },
        
        activo : {
            type : Boolean,
            required : true
        }

    },{
        timestamps : true,
        collection : 'productos'
    })  

    usuarioSchema.loadClass(Producto)

    export const ProductoModel = mongoose.model('Producto', productoSchema)