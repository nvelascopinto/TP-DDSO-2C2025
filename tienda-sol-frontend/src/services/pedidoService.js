import {apiBack} from "./apiBack.js"
import { EstadoPedido } from "../../enums.js"

export async function crearPedido(user, vendedor, items, direccion){
    return apiBack.post('/pedidos',
        {
            vendedor,
            items,
            moneda: "PESO_ARG",
            direccionEntrega: direccion
        },
        {
            headers: { 'X-User': user }
        })
    .then((response) => {
        return response.data
    })
}

// export async function cancelarPedido(id, user){
//     return apiBack.patch(`/pedidos/${id}`,
//         {
//             nuevoEstado: EstadoPedido.CANCELADO
//         },
//         {
//             headers: { 'X-User': user}
//         }
//     )
//     .then((response) => {
//         return response.data
//     })

// }

export async function cambiarEstadoPedido(id, nuevoEstado, user) {
    return apiBack.patch(`/pedidos/${id}`,
        {
            estado: nuevoEstado
        },
        {
            headers: { 'X-User': user }
        }
    )
    .then((response) => {
        return response.data
    })

}