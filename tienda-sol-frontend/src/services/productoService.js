import {apiBack} from "./apiBack.js"

export function getProductosByVendedor (filters){ 
    return apiBack.get('/productos',{
        params: filters
  })
  .then((response) => {
        return response.data
    })
}


//get producto by id

export async function actualizarProducto (id, productData){
    return apiBack.patch('/productos/${id}', productData)
    .then((response) => {
        return response.data
    })
    .catch((error) => {
      console.error("Error actualizando producto:", error);
      throw error.response?.data || error;
    });
}

export async function crearProducto (usuario, productData){
    return apiBack.post('/',{
    usuario : usuario,
    body : productData
    })
    .then((response) => {
        return response.data
    })
}


//        titulo: titulo,
//        descripcion: descripcion,
//        precio: precio,
//        moneda: moneda,
//        stock: stock,
//        fotos: fotos,
//        activo: Boolean,
//        cantVentas: Number