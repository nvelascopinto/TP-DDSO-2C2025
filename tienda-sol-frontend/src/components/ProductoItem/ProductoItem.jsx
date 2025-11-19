import { useEffect, useState } from 'react';
import Spinner from '../Spinner/Spinner';
import { getProductoById } from '../../services/productoService.js';
import "./Producto.Item.css"

const ProductoItem = ({ item }) => {
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProductoById(item.producto._id)
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
  }, [item.producto._id]);

  if (loading) {
    return (
      <div 
        className="producto producto--loading"
        aria-busy="true"
        aria-label="Cargando información del producto"
      >
        <Spinner>Cargando Producto...</Spinner>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div 
        className="producto producto--error"
        role="alert"
        aria-label="Error al cargar producto"
      >
        <p>{error || 'Producto no disponible'}</p>
      </div>
    );
  }

  return (
    <article 
      className="producto"
      aria-label={`Producto: ${producto.titulo}`}
    >
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
          ${item.precioUnitario} {producto.moneda || 'ARS'}
        </p>
      </div>

      <div className="producto__summary">
        <div className="producto__quantity">
          <span className="producto__label">
            Cantidad: {item.cantidad}
          </span>
        </div>

        <div className="producto__subtotal">
          <span className="producto__label">
            Subtotal: ${item.precioUnitario * item.cantidad} {producto.moneda || 'ARS'}
          </span>
        </div>
      </div>
    </article>
  );
};

export default ProductoItem;