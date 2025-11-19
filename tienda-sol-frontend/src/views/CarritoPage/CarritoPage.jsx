
import React, { useState } from 'react';
import { useCart, useAuth } from '../../contexts/AppContext.jsx';
import CartItem from '../../components/CartItem/CartItem.jsx';
import Button from '../../components/Button/Button.jsx';
import { api } from '../../services/mockService.js';
import './CarritoPage.css';
import Cart from '../../components/Cart/Cart.jsx';

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
        <div  aria-label="Contenido del carrito de compras">
        <Cart  isProcessing={isProcessing} handle = {handleDireccion} navigateTo={navigateTo}/>
      </div> 
     </div> 
     <div className = "cart-page-volver" aria-label="Volver a la página de inicio"> 
          {!(isProcessing || cartItems.length === 0) ? (
            <Button onClick={() => navigateTo('home')} variant="secondary">
            Volver
          </Button>
          ):(<div></div>)
          }
          
      </div>
    </div>        
  );
};

export default CarritoPage;
