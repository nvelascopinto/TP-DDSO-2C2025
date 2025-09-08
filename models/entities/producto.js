import { z } from "zod"

export class Producto { // falta id
    constructor(vendedor, titulo, descripcion, categoria, precio, moneda, stock, fotos, activo){
        z.object({
        stock: z.number().nonnegative(),
        precio: z.number().nonnegative()
        })
        this.vendedor = vendedor
        this.titulo = titulo
        this.descripcion = descripcion
        this.categoria = categoria
        this.precio = precio
        this.moneda = moneda
        this.stock = stock
        this.fotos = fotos
    }

    estaDisponible(cantidad) {
        return this.stock >= cantidad
    }

    reducirStock(cantidad) {
        this.stock -= cantidad
    }

    aumentarStock(cantidad) {
        this.stock += cantidad
    }
}