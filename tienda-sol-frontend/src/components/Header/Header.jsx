import React, { useState, useEffect } from 'react';
import { useAuth, useCart } from '../../contexts/AppContext.jsx';
import NotificationBell from '../NotificationBell/NotificationBell.jsx';
import './Header.css';
import logo from "../../assets/logo.svg";

const Header = ({ navigateTo, currentRoute }) => {
  const { currentUser, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const cartItemCount = getCartItemCount();

  const [activeTab, setActiveTab] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigateTo('home');
    setIsMenuOpen(false);
  };

  const handleNavigate = (route) => {
    navigateTo(route);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (currentRoute) {
      setActiveTab(currentRoute);
    }
  }, [currentRoute]);

  useEffect(() => {
    if (!currentRoute) {
      if (currentUser?.tipo === "COMPRADOR") {
        setActiveTab("");
      } else if (currentUser?.tipo === "VENDEDOR") {
        setActiveTab("productos");
      }
    }
  }, [currentUser, currentRoute]);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.header__nav') && !event.target.closest('.header__hamburger')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const showCart = currentUser?.tipo !== 'VENDEDOR';

  return (
    <header className="header">
      <div className="header__container container">
        <div
          className="header__logo"
          onClick={() => { 
            if (currentUser?.tipo !== 'VENDEDOR') {
              navigateTo('');
            }
          }}
        >
          <img src={logo} alt="Logo Tienda Sol" className="header__logo-image" />
          <span className="header__logo-text">Tienda Sol</span>
        </div>

        {/* Botón Hamburguesa - Solo móvil */}
        <button 
          className="header__hamburger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menú"
        >
          <span className={`header__hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`header__hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`header__hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
        </button>

        <nav className={`header__nav ${isMenuOpen ? 'open' : ''}`}>
          {currentUser?.tipo === 'COMPRADOR' && (
            <button
              onClick={() => handleNavigate('historial-pedidos')}
              className={`header__nav-link ${activeTab === "historial-pedidos" ? "active" : ""}`}
            >
              Mis Pedidos
            </button>
          )}

          {currentUser?.tipo === 'VENDEDOR' && (
            <div className="header__nav-vendor-links">
              <button
                onClick={() => handleNavigate('productos')}
                className={`header__nav-link ${activeTab === "productos" ? "active" : ""}`}
              >
                Productos
              </button>
              <button
                onClick={() => handleNavigate('pedidos')}
                className={`header__nav-link ${activeTab === "pedidos" ? "active" : ""}`}
              >
                Pedidos
              </button>
            </div>
          )}

          {showCart && (
            <button
              className={`header__nav-link header__cart-icon ${activeTab === "carrito" ? "active" : ""}`}
              onClick={() => handleNavigate('carrito')}
            >
              <span className="material-symbols-outlined">
                shopping_cart_checkout
              </span>
              {cartItemCount > 0 && (
                <span key={cartItemCount} className="header__cart-badge">
                  {cartItemCount}
                </span>
              )}
            </button>
          )}

          {currentUser && (
            <button
              className={`header__nav-link header__notification-icon  ${activeTab === "notificaciones" ? "active" : ""}`}
              onClick={() => handleNavigate('notificaciones')}
            >
              <NotificationBell />
            </button>
          )}

          {currentUser ? (
            <div className="header__user-info">
              <span className="header__user-greeting">
                Hola, {currentUser.nombre.split(' ')[0]}
              </span>
              <button onClick={handleLogout} className="header__logout-button">
                Salir
              </button>
            </div>
          ) : (
            <div className="header__user-info">
              <button 
                onClick={() => handleNavigate('login')}
                className="header__login-button"
              >
                Ingresar
              </button>

              <button
                onClick={() => handleNavigate('register')}
                className="header__register-button"
              >
                Registrarse
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;