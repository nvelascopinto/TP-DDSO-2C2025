import {apiBack} from "./apiBack.js"

export async function crearPedido(user, vendedor, items, total){
    return apiBack.post('/',{
    vendedor: vendedor
    //comprador: user
    //items: items
    //total: total
    })
    .then((response) => {
        return response.data
    })
}
//header ex aud

export async function cancelarPedido(id){
    return apiBack.patch('/pedidos/${id}',{
        //body
        //estado cancelar
    })
    .then((response) => {
        return response.data
    })

}

export async function cambiarEstadoPedido(id, nuevoEstado) {
    return apiBack.patch('/pedidos/${id}',{
        body:productData
    })
    .then((response) => {
        return response.data
    })

}