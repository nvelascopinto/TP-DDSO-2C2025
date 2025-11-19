import React, { useState } from 'react';
import { useAuth, useCart } from '../../contexts/AppContext.jsx';
import './ProductCard.css';
import { TipoUsuario } from '../../../enums.js';

const ProductCard = ({ producto }) => {
  const { addToCart, showToast, cartItems, clearCart } = useCart();
  const { currentUser } = useAuth();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const cantidadEnCarrito = cartItems.reduce((total, item) => {
    if (item.producto._id === producto._id) {
      return total + item.cantidad;
    }
    return total;
  }, 0);
  
  const handleAddToCart = () => {
    if (producto.stock <= 0) {
      showToast(`"${producto.titulo}" no tiene stock disponible`, 'error');
      return;
    }
    const cantidadEnCarrito = cartItems.reduce((total, item) => {
    if (item.producto._id === producto._id) { return total + item.cantidad;}}, 0);

      if (cantidadEnCarrito >= producto.stock) {
      showToast(`No puedes agregar más unidades. Stock disponible: ${producto.stock}`, 'error');
      return;
    }

    if (cartItems.length === 0) {
      addToCart(producto);
      showToast(`"${producto.titulo}" agregado al carrito`);
      return;
    }

    const vendedorActual = cartItems[0].producto.vendedor;

    if (producto.vendedor === vendedorActual) {
      addToCart(producto);
      showToast(`"${producto.titulo}" agregado al carrito`);
    } else {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmReplace = () => {
    clearCart();
    addToCart(producto);
    showToast(`Carrito actualizado. "${producto.titulo}" agregado`);
    setShowConfirmModal(false);
  };

  const handleCancelReplace = () => {
    setShowConfirmModal(false);
  };

 const agregarIsDisabled = (currentUser ? currentUser.tipo === TipoUsuario.VENDEDOR : false) || 
                           producto.stock <= 0 || 
                           cantidadEnCarrito >= producto.stock;


return (
    <>
      <div 
        className="product-card"
        role="article"
        aria-label={`Producto: ${producto.titulo}`}
      >
        <img
          src={producto.fotos[0]}
          alt={producto.titulo}
          className="product-card__image"
        />

        <div className="product-card__content">
          <h3 className="product-card__title">{producto.titulo}</h3>
          <p className="product-card__description">{producto.descripcion}</p>

          <div className="product-card__footer">
            <span className="product-card__price">
              ${producto.precio.toFixed(2)}
            </span>

            <button
              onClick={handleAddToCart}
              className="product-card__button"
              disabled={agregarIsDisabled}
              aria-disabled={agregarIsDisabled ? "true" : "false"}
              aria-label={`Agregar ${producto.titulo} al carrito`}
            >
              {producto.stock <= 0
                ? 'Sin stock'
                : cantidadEnCarrito >= producto.stock
                ? 'Sin stock'
                : 'Agregar'}
            </button>
          </div>
        </div>
      </div>

      {showConfirmModal ? (
        <div 
          className="modal-overlay" 
          onClick={handleCancelReplace}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-message"
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="modal-title" className="modal-title">Cambiar vendedor</h3>

            <p id="modal-message" className="modal-message">
              Tu carrito contiene productos de otro vendedor. <br />
              ¿Deseas vaciar el carrito y agregar este producto?
            </p>

            <div className="modal-actions">
              <button
                onClick={handleCancelReplace}
                className="modal-button modal-button--cancel"
              >
                Cancelar
              </button>

              <button
                onClick={handleConfirmReplace}
                className="modal-button modal-button--confirm"
              >
                Sí, deseo vaciar el carrito
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ProductCard;
