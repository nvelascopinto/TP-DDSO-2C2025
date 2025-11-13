
import React, { useState } from 'react';
import { useCart, useAuth } from '../../contexts/AppContext.jsx';
import CartItem from '../../components/CartItem/CartItem.jsx';
import Button from '../../components/Button/Button.jsx';
import { api } from '../../services/mockService.js';
import './CarritoPage.css';
//import { crearPedido } from '../../services/pedidoService.js';

const CarritoPage = ({ onLoginRequest, navigateTo }) => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDireccion = (() =>{
    if (!currentUser) {
      onLoginRequest();
      return;
    }
    if (cartItems.length === 0) return;
    navigateTo("checkout")
  })
 

  return (
    <div>
      <div className="cart-page">
        <h1 className="cart-page__title">Tu Carrito de Compras</h1>
        {cartItems.length === 0 ? (
          <div className="cart-page__empty-container">
            <p className="cart-page__empty-message">Tu carrito está vacío.</p>
            <Button onClick={() => navigateTo('home')} variant="primary">
              Empezar a Comprar
            </Button>
          </div>
        ) : (
          <>
            <div role="list" className="cart-page__item-list">
              {cartItems.map((item) => (
                <CartItem key={item.producto._id} item={item} role="listitem"/>
              ))}
            </div>
            <div className="cart-page__summary">
              <div className="cart-page__total" aria-live="polite">
                Total: <span>${getCartTotal().toFixed(2)}</span>
              </div>
            
              <Button onClick={handleDireccion} disabled={isProcessing || cartItems.length === 0}>
                <span aria-busy={isProcessing ? 'true' : 'false'}> 
                {isProcessing ? 'Procesando...' : 'Finalizar Compra'}
                </span>
              </Button>
            </div>
          </> )}
     </div> 
     <div className = "cart-page-volver"> 
          {!(isProcessing || cartItems.length === 0) ? (
            <Button onClick={() => navigateTo('home')} variant="primary">
            Volver
          </Button>
          ):(<div></div>)
          }
          
      </div>
    </div>        
  );
};

export default CarritoPage;
