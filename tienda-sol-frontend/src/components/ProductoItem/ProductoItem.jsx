import { useEffect, useState } from 'react';
import Spinner from '../Spinner/Spinner';
import { getProductoById } from '../../services/productoService.js';
import "./Producto.Item.css"

const ProductoItem = ({ item }) => {
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProductoById(item.productoId)
      .then((prod) => {
        setProducto(prod);
      })
      .catch((err) => {
        console.error('Error cargando producto:', err);
        setError('Error al cargar el producto');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [item.productoId]);

  if (loading) {
    return (
      <div className="producto producto--loading">
        <Spinner>Cargando Producto...</Spinner>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="producto producto--error">
        <p>{error || 'Producto no disponible'}</p>
      </div>
    );
  }

 
  return (
    <article className="producto">
    
      <div className="producto__image-container">
        <img 
          src={producto.fotos?.[0] || '/placeholder-image.jpg'} 
          alt={producto.titulo} 
          className="producto__image" 
        />
      </div>

      <div className="producto__info">
        <h4 className="producto__title" title={producto.titulo}>
          {producto.titulo}
        </h4>
        <p className="producto__price-unit">
          ${item.subtotal / item.cantidad} {producto.moneda || 'ARS'}
        </p>
      </div>

      <div className="producto__summary">
        <div className="producto__quantity">
          <span className="producto__label">Cantidad:</span>
          <span className="producto__value">{item.cantidad}</span>
        </div>
        <div className="producto__subtotal">
          <span className="producto__label">Subtotal:</span>
          <span className="producto__value producto__value--price">
            ${item.subtotal} {producto.moneda || 'ARS'}
          </span>
        </div>
      </div>
    </article>
  );
};

export default ProductoItem;