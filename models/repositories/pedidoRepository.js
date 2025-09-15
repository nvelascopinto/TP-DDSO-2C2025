export class pedidoRepository {
    constructor(){
        this.pedidos=[]
        this.nextId = 1
    }

    crear(pedido){
        pedido.id = this.nextId++;
        this.pedidos.push(pedido)
        return pedido
    }

    consultar(id){
        const pedido = this.findById(id)
        return pedido 
    }

    consultarHistorial(id) {
        const pedidosUsuario = this.pedidos.filter(p => p.id === id)
        return pedidosUsuario
    }

    // FUNCIONES AUXILIARES

    findById(id) {
        return this.pedidos.find(p => p.id === id) || null
    }
}