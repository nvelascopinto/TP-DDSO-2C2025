import {apiBack} from "./apiBack.js"

export async function getNotificacionesNoLeidas(user){
    return apiBack.get("/notificaciones/noleidas",
    {
            headers: { 'X-User': user }
    })
    .then((response) => {
        return response.data
    })
}

export async function getNotificaciones(user){
    return apiBack.get("/notificaciones/",
    {
            headers: { 'X-User': user }
    })
    .then((response) => {
        return response.data
    })
}

export async function getNotificacionesLeidas(user){
    return apiBack.get("/notificaciones/leidas",
    {
        headers: { 'X-User': user }
    })
    .then((response) => {
        return response.data
    })
}

export async function marcarNotificacionComoLeida(id, user){
    return apiBack.patch(`/notificaciones/${id}`, {},
    {
        headers: { 'X-User': user }
    })
    .then((response) => {
        return response.data
    })
}

