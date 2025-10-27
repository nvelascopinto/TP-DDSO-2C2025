import { useEffect, useState } from 'react';
import './Producto.Item.css';
import { api } from '../../services/mockService.js';
import Spinner from '../Spinner/Spinner';

const ProductoItem = ({ item}) => {
    const [producto, setProducto] = useState(null)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        api.getProductoById(item.productoId).then((prod) => 
        setProducto(prod)).finally(()=>{
            console.log("PRODUCTO" +producto)
            setLoading(false)
        })
    }
    )
     if(loading) {
        return <Spinner> Cargando Producto ...</Spinner>
     } else { 
        return (
    <div className="producto">
      <div className="producto__details">
        <img src={producto.fotos[0]} alt={producto.titulo} className="producto__image" />
        <div>
          <h4 className="producto__title">{producto.titulo}</h4>
          <p className="producto__price">${(item.subtotal / item.cantidad).toFixed(2)}{producto.moneda}</p>
        </div>
      </div>
      <div>
      {/* <div className="producto__actions"> //product actions */}
        <span className="producto__details">{item.cantidad}</span>
        <span className="producto__details">${item.subtotal}{producto.moneda} </span>
      </div>


    </div>
  );
     }
  
};

export default ProductoItem;