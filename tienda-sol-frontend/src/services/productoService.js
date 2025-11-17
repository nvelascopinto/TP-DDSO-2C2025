import {apiBack} from "./apiBack.js"

export async function getProductosByVendedor (filters){ 
    return apiBack.get('/productos',{
        params: filters
  })
  .then((response) => {
        return response.data
    })
}

export async function getProductoById(id){
    return apiBack.get(`/productos/${id}`)
    .then((response) => {
        return response.data
    })
    .catch((error) => {
      console.error("Error obteniendo producto:", error);
      throw error.response?.data || error;
    });
}

//get producto by id

export async function actualizarProducto (id, productData, usuario){
    return apiBack.patch(`/productos/${id}`,
        productData, 
        {
            headers: {
                'X-User': usuario,
            }
        }
    )
    .then((response) => {
        return response.data
    })
    .catch((error) => {
      console.error("Error actualizando producto:", error);
      throw error.response?.data || error;
    });
}

export async function crearProducto (usuario, productData){
    return apiBack.post('/productos',
        productData, 
        {
            headers: {
                'X-User': usuario,
            }
        }
    )
    .then((response) => {
        return response.data
    })
}

export async function eliminarProducto(productId, username) {
    return apiBack.delete(`/productos/${productId}`,
        {
            headers: {
                'X-User': username,
            }
        }
    )
    .then((response) => {
        return 
    })
    .catch((error) => {
      console.error("Error actualizando producto:", error);
      throw error.response?.data || error;
    });
}   

