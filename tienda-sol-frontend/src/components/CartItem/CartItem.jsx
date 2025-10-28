
import React from 'react';
import { useCart } from '../../contexts/AppContext.jsx';
import './CartItem.css';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="cart-item" role='listitem'>
      <div className="cart-item__details">
        <img src={item.producto.fotos[0]} alt={item.producto.titulo} className="cart-item__image" />
        <div>
          <h4 className="cart-item__title">{item.producto.titulo}</h4>
          <p className="cart-item__price">${item.producto.precio.toFixed(2)}</p>
        </div>
      </div>
      <div className="cart-item__actions">
        <div className="quantity-control">
          <button onClick={() => updateQuantity(item.producto.id, item.cantidad - 1)} className="quantity-control__button">-</button>
          <span className="quantity-control__display">{item.cantidad}</span>
          <button onClick={() => updateQuantity(item.producto.id, item.cantidad + 1)} className="quantity-control__button">+</button>
        </div>
        <span className="cart-item__subtotal">${(item.producto.precio * item.cantidad).toFixed(2)}</span>
        <button onClick={() => removeFromCart(item.producto.id)} className="cart-item__remove-button">
          <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
