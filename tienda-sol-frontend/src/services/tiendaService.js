import {apiBack} from "./apiBack.js"

export async function getTiendaByVendedor(nombre){
    return apiBack.get(`/tiendas/${nombre}`)
    .then((response) => {
        console.log("PEGADA AL BACK" + response.data.nombre)
        return response.data
    })
    .catch((error) => {
      console.error("Error obteniendo tienda:", error);
      throw error.response?.data || error;
    });
}

export async function getTiendas (){ 
    return apiBack.get('/tiendas')
    .then((response) => {
        return response.data
    }) }
