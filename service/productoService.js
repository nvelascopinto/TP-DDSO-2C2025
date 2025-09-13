import { ProductoRepository } from "../models/repositories/productoRepository.js"
import { productoSchema } from "../validadores/validadorProducto.js"
import express from "express"
import { ProductoInvalido } from "../errors/productoInvalido.js"

export class ProductoService {

    constructor(productoRepository) {
        this.productoRepository = productoRepository
    }
    
    crear(nuevoProducto) {

       const resultProducto = productoSchema.safeParse(nuevoProducto)

       if(resultProducto.error) {
        
        throw new ProductoInvalido(resultProducto.error.issues.map(i => i.message))
       }

        const productoGuardado = this.productoRepository.crear(resultProducto.data)

        return productoGuardado
    }

}