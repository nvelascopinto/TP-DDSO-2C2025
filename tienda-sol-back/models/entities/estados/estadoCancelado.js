import { Estado } from "../estado.js"
class Cancelado extends Estado {
    constructor() {
        super(
            [],
            ["Vendedor", "Admin", "Comprador"],
            "Cancelado"
        );
    }

    accionPostCambio(pedido){
        pedido.items.forEach(item => {
            item.producto.aumentarStock(item.cantidad);
        }); 
    }
}

export const cancelado = new Cancelado();