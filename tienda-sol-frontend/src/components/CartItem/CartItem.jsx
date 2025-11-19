
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
    <div 
      className="cart-item" 
      role="listitem"
      aria-label={`Producto ${item.producto.titulo}`}
    >
      <div className="cart-item__details">
        <img 
          src={item.producto.fotos[0]} 
          alt={`Imagen de ${item.producto.titulo}`} 
          className="cart-item__image" 
        />

        <div>
          <h4 
            className="cart-item__title"
            aria-label={`Título: ${item.producto.titulo}`}
          >
            {item.producto.titulo}
          </h4>

          <p 
            className="cart-item__price"
            aria-label={`Precio unitario ${item.producto.precio.toFixed(2)} pesos`}
          >
            ${item.producto.precio.toFixed(2)}
          </p>

          {isMaxReached && (
            <p 
              className="cart-item__max-stock"
              role="alert"
            >
              Has alcanzado el límite de unidades disponibles.
            </p>
          )}
        </div>
      </div>

      <div className="cart-item__actions">
        <div 
          className="quantity-control"
          aria-label="Control de cantidad"
        >
          <button 
            onClick={handleDecrement} 
            className="quantity-control__button"
            aria-label="Restar una unidad"
            disabled={item.cantidad <= 1}
          >
            -
          </button>

          <span 
            className="quantity-control__display"
            aria-live="polite"
          >
            {item.cantidad}
          </span>

          <button 
            onClick={handleIncrement} 
            className="quantity-control__button"
            aria-label="Sumar una unidad"
            disabled={isMaxReached}
          >
            +
          </button>
        </div>

        <span 
          className="cart-item__subtotal"
          aria-label={`Subtotal ${(
            item.producto.precio * item.cantidad
          ).toFixed(2)} pesos`}
        >
          ${(item.producto.precio * item.cantidad).toFixed(2)}
        </span>

        <button 
          onClick={() => removeFromCart(item.producto._id)} 
          className="cart-item__remove-button"
          aria-label={`Eliminar ${item.producto.titulo} del carrito`}
        >
          <span className="material-symbols-outlined">delete</span>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
