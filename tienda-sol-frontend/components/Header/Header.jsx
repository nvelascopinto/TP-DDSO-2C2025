import React from 'react';
import { useAuth, useCart } from '../../contexts/AppContext.jsx';
import NotificationBell from '../NotificationBell/NotificationBell.jsx';
import './Header.css';

const Header = ({ navigateTo }) => {
  const { currentUser, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const cartItemCount = getCartItemCount();

  const handleLogout = () => {
    logout();
    navigateTo('home');
  };

  // FIX: Cart is now shown to guest users, and hidden only for sellers.
  const showCart = currentUser?.tipo !== 'VENDEDOR';

  return (
    <header className="header">
      <div className="header__container container">
        <div
          className="header__logo"
          onClick={() => navigateTo('home')}
        >
          <span className="header__logo-text">Tienda Sol</span>
        </div>

        <nav className="header__nav">
          {currentUser?.tipo === 'COMPRADOR' && (
            <button
              onClick={() => navigateTo('orderHistory')}
              className="header__nav-link"
            >
              Mis Pedidos
            </button>
          )}

          {currentUser?.tipo === 'VENDEDOR' && (
            <button
              onClick={() => navigateTo('dashboard')}
              className="header__nav-link"
            >
              Mi Panel
            </button>
          )}

          {showCart && (
            <div
              className="header__cart-icon"
              onClick={() => navigateTo('cart')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartItemCount > 0 && (
                <span className="header__cart-badge">{cartItemCount}</span>
              )}
            </div>
          )}

          {currentUser && (
            <NotificationBell onClick={() => navigateTo('notifications')} />
          )}

          {currentUser ? (
            <div className="header__user-info">
              <span className="header__user-greeting">
                Hola, {currentUser.nombre.split(' ')[0]}
              </span>
              <button
                onClick={handleLogout}
                className="header__logout-button"
              >
                Salir
              </button>
            </div>
          ) : (
            // FIX: Added a login button for unauthenticated users.
            <button
              onClick={() => navigateTo('login')}
              className="header__login-button"
            >
              Ingresar
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
