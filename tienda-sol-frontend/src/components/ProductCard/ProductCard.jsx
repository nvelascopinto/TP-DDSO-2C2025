
import React, {useState} from 'react';
import { useAuth, useCart } from '../../contexts/AppContext.jsx';
import './ProductCard.css';
import { TipoUsuario } from '../../../enums.js';

const ProductCard = ({ producto }) => {
  const { addToCart, showToast, cartItems, clearCart } = useCart();
  const {currentUser} = useAuth();
  const [showConfirmModal, setShowConfirmModal] = useState(false);


  //const handleAddToCart = () => {
    //addToCart(producto);
    //showToast(`"${producto.titulo}" agregado al carrito`);
  //};

  const handleAddToCart = () => {
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
      // Si es de otro vendedor, mostrar confirmación
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
      {showConfirmModal && (
        <div className="modal-overlay" onClick={handleCancelReplace}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Cambiar vendedor</h3>
            <p className="modal-message">
              Tu carrito contiene productos de otro vendedor. 
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
                Sí. Deseo vaciar el carrito
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
