
import React from 'react';
import { useCart } from '../../contexts/AppContext.jsx';
import './CartItem.css';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart, showToast} = useCart();

    const handleIncrement = () => {
  
    if (item.cantidad >= item.producto.stock) {
      showToast(`Has alcanzado el límite de unidades disponibles.`, 'error');
      return;
    }
    
    updateQuantity(item.producto._id, item.cantidad + 1);
  };

  const handleDecrement = () => {
    if (item.cantidad > 1) {
      updateQuantity(item.producto._id, item.cantidad - 1);
    }
  };

  const isMaxReached = item.cantidad >= item.producto.stock;


  return (
    <div className="cart-item" role='listitem'>
      <div className="cart-item__details">
        <img src={item.producto.fotos[0]} alt={item.producto.titulo} className="cart-item__image" />
        <div>
          <h4 className="cart-item__title">{item.producto.titulo}</h4>
          <p className="cart-item__price">${item.producto.precio.toFixed(2)}</p>
          {isMaxReached && (
            <p className="cart-item__max-stock">Has alcanzado el límite de unidades disponibles.</p>
          )}
        </div>
      </div>
      <div className="cart-item__actions">
        <div className="quantity-control">
          <button onClick={handleDecrement} className="quantity-control__button">-</button>
          <span className="quantity-control__display">{item.cantidad}</span>
          <button onClick={handleIncrement} className="quantity-control__button"
                  disabled={isMaxReached}>+</button>
        </div>
        <span className="cart-item__subtotal">${(item.producto.precio * item.cantidad).toFixed(2)}</span>
        <button onClick={() => removeFromCart(item.producto._id)} className="cart-item__remove-button">
          <span className="material-symbols-outlined">delete</span>
        </button> 
      </div>
    </div>
  );
};

export default CartItem;
