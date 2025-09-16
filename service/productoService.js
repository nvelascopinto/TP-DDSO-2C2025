import { ProductoRepository } from "../models/repositories/productoRepository.js"
import { UsuriosService } from "./usuariosService.js"
import { productoSchema } from "../validadores/validadorProducto.js"
import express from "express"
import { monedaValidator } from "../validadores/validadorMoneda.js"
import { tipoUsuario } from "../models/entities/tipoUsuario.js"
import { Producto } from "../models/entities/producto.js"
import { DatosInvalidos } from "../errors/datosInvalidos.js"
import { keyof } from "zod"

export class ProductoService {

    constructor(productoRepository, usuarioService) {
        this.productoRepository = productoRepository
        this.usuarioService = usuarioService
    }
    
    crear(productoDTO) {

        const resultProducto = this.convertirDTOaProducto(productoDTO)

        const productoGuardado = this.productoRepository.crear(resultProducto)

        return productoGuardado
    }

    convertirDTOaProducto(productoDTO) {

        const resultProd = productoSchema.safeParse(productoDTO)
        
       if(resultProd.error) {
        throw new DatosInvalidos(resultProd.error.issues.map(i => i.message))
       }

       const resultProducto = resultProd.data
       const moneda = monedaValidator(productoDTO.moneda)

       if (!moneda) {
                throw new DatosInvalidos("La moneda ingresada no esta dentro de las opciones ofrecidas")
        }

       const vendedor = this.usuarioService.obtenerUsuario(productoDTO.vendedorID, [tipoUsuario.VENDEDOR])

       return new Producto(vendedor, resultProducto.titulo, resultProducto.descripcion, resultProducto.categoria, resultProducto.precio, moneda, resultProducto.stock, resultProducto.fotos, resultProducto.activo)
    }
}