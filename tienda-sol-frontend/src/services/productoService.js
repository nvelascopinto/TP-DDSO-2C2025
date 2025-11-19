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

export async function verificarStockProductos(productos) {
    try {
        // productos es un array de { productoId, cantidadSolicitada }
        const verificaciones = await Promise.all(
            productos.map(async (item) => {
                const producto = await getProductoById(item.productoId);
                return {
                    productoId: item.productoId,
                    titulo: producto.titulo,
                    stockDisponible: producto.stock,
                    cantidadSolicitada: item.cantidadSolicitada,
                    suficiente: producto.stock >= item.cantidadSolicitada
                };
            })
        );

        const productosSinStock = verificaciones.filter(v => !v.suficiente);
        
        return {
            stockSuficiente: productosSinStock.length === 0,
            productosSinStock: productosSinStock,
            detalles: verificaciones
        };
    } catch (error) {
        console.error("Error verificando stock:", error);
        throw error;
    }
}

