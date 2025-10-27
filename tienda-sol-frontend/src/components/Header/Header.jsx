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

  const handleLogout = () => {
    logout();
    navigateTo('home');
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
          style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
        >
          <img src={logo} alt="Logo Tienda Sol" className="header__logo-image" />
          <span className="header__logo-text">Tienda Sol</span>
        </div>

        <nav className="header__nav">
          {currentUser?.tipo === 'COMPRADOR' && (
            <button
              onClick={() => navigateTo('historial-pedidos')}
              className={`header__nav-link ${activeTab === "historial-pedidos" ? "active" : ""}`}
            >
              Mis Pedidos
            </button>
          )}

          {currentUser?.tipo === 'VENDEDOR' && (
            <div className="header__nav-vendor-links">
              <button
                onClick={() => navigateTo('productos')}
                className={`header__nav-link ${activeTab === "productos" ? "active" : ""}`}
              >
                Productos
              </button>
              <button
                onClick={() => navigateTo('pedidos')}
                className={`header__nav-link ${activeTab === "pedidos" ? "active" : ""}`}
              >
                Pedidos
              </button>
            </div>
          )}

          {showCart && (
            <button
              className={`header__nav-link header__cart-icon ${activeTab === "carrito" ? "active" : ""}`}
              onClick={() => navigateTo('carrito')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "26px" }}>
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
              className={`header__nav-link ${activeTab === "notificaciones" ? "active" : ""}`}
              onClick={() => navigateTo('notificaciones')}
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
                onClick={() => navigateTo('login')}
                className="header__login-button"
              >
                Ingresar
              </button>

              <button
                onClick={() => navigateTo('register')}
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
