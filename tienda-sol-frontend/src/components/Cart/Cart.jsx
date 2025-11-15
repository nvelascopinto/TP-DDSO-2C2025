import React from "react";
import { useCart } from "../../contexts/AppContext.jsx";
import CartItem from "../CartItem/CartItem.jsx";
import Button from "../Button/Button.jsx";
import './Cart.css';

export const Cart = ({ handle, isProcessing , onClose, navigateTo}) => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  
  return (
    <div>
      {cartItems.length === 0 ? (
        <div className="cart-page__empty-container">
          <p className="cart-page__empty-message">Tu carrito está vacío.</p>
          <Button 
            onClick={() => {
              if (onClose) onClose();
              navigateTo('home');
               
            }}
            variant="primary"
          >
            Empezar a Comprar
          </Button>
        </div>
      ) : (
        <>
          <div role="list">
            {cartItems.map((item) => (
              <CartItem key={item.producto._id} item={item} role="listitem" />
            ))}
          </div>
          <div className="cart-page__summary">
            <div className="cart-page__total" aria-live="polite">
              Total: <span>${getCartTotal().toFixed(2)}</span>
            </div>
            
            <Button 
              onClick={handle} 
              disabled={isProcessing || cartItems.length === 0}
            >
              <span aria-busy={isProcessing ? 'true' : 'false'}> 
                {isProcessing ? 'Procesando...' : 'Finalizar Compra'}
              </span>
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;