
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
          <span className="material-symbols-outlined">delete</span>
        </button> 
      </div>
    </div>
  );
};

export default CartItem;
