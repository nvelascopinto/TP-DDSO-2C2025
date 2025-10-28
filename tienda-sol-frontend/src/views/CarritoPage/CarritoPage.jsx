
import React, { useState } from 'react';
import { useCart, useAuth } from '../../contexts/AppContext.jsx';
import CartItem from '../../components/CartItem/CartItem.jsx';
import Button from '../../components/Button/Button.jsx';
import { api } from '../../services/mockService.js';
import './CarritoPage.css';

const CarritoPage = ({ onLoginRequest, navigateTo }) => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleCheckout = async () => {
    if (!currentUser) {
      onLoginRequest();
      return;
    }
    if (cartItems.length === 0) return;

    setIsProcessing(true);
    try {
      const vendedorId = cartItems[0].producto.vendedorId;
      const items = cartItems.map(item => ({
        productoId: item.producto.id,
        cantidad: item.cantidad,
        precioUnitario: item.producto.precio
      }));
      const total = getCartTotal();

      await api.crearPedido(currentUser.id, vendedorId, items, total);

      setOrderPlaced(true);
      clearCart();
    } catch (error) {
      console.error("Error creando la orden: ", error);
      alert("Hubo un error al procesar tu pedido. Intenta de nuevo.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="order-success-message" role="status" aria-live="polite">
        <h1 className="order-success-message__title">¡Gracias por tu compra!</h1>
        <p>Tu pedido ha sido realizado con éxito.</p>
        <p>Recibirás notificaciones sobre su estado.</p>
        <Button onClick={() => navigateTo('home')} variant="primary" className="button--margin-top">
          Volver a la tienda
        </Button>
      </div>
    );
  }

  return (
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
              <CartItem key={item.producto.id} item={item} role="listitem"/>
            ))}
          </div>
          <div className="cart-page__summary">
            <div className="cart-page__total" aria-live="polite">
              Total: <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <Button onClick={handleCheckout} disabled={isProcessing || cartItems.length === 0}>
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

export default CarritoPage;
