
import React, {useState} from 'react';
import { useAuth, useCart } from '../../contexts/AppContext.jsx';
import './ProductCard.css';
import { TipoUsuario } from '../../../enums.js';

const ProductCard = ({ producto }) => {
  const { addToCart, showToast } = useCart();
  const {currentUser} = useAuth();

  const handleAddToCart = () => {
    addToCart(producto);
    showToast(`"${producto.titulo}" agregado al carrito`);
  };

  
  return (
    <div className="product-card">
        <img src={producto.fotos[0]} alt={producto.titulo} className="product-card__image" />
      <div className="product-card__content">
        <h3 className="product-card__title">{producto.titulo}</h3>
        <p className="product-card__description">{producto.descripcion}</p>
        <div className="product-card__footer">
          <span className="product-card__price">${producto.precio.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            className="product-card__button"
            disabled={currentUser.tipo == TipoUsuario.VENDEDOR}
            aria-label={`Agregar ${producto.titulo} al carrito`}
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
