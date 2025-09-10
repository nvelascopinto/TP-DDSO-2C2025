export class itemPedido{
    constructor(producto, cantidad, precioUnitario){
        
        this.producto = producto
        this.cantidad = cantidad
        this.precioUnitario = precioUnitario
    }

    subtotal(){
        return this.precioUnitario * this.cantidad
    }

}

export const itemPedidoSchema = z.object({
        precioUnitario: z.number().nonnegative(),
        cantidad: z.number().nonnegative() // y no 0 ?
        })