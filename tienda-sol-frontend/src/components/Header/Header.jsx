import React from 'react';
import { useAuth, useCart } from '../../contexts/AppContext.jsx';
import { useState, useEffect } from 'react';
import NotificationBell from '../NotificationBell/NotificationBell.jsx';
import './Header.css';
import logo from "../../assets/logo.svg";


const Header = ({ navigateTo, currentRoute }) => {
  const { currentUser, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const cartItemCount = getCartItemCount();
  const handleLogout = () => {
    logout();
    navigateTo('home');
  };

  const [activeTab, setActiveTab] = useState("home");

  // Sincronizar activeTab con la ruta actual
  useEffect(() => {
    if (currentRoute) {
      setActiveTab(currentRoute);
    }
  }, [currentRoute]);

  // Establecer tab inicial según tipo de usuario
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
            if (currentUser?.tipo === 'VENDEDOR') {
              
            } else {
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
              onClick={() => {
                navigateTo('historial-pedidos');
              }}
              className={`header__nav-link ${activeTab === "historial-pedidos" ? "active" : ""}`}
            >
              Mis Pedidos
            </button>
          )}

          {currentUser?.tipo === 'VENDEDOR' && (
            <div className="header__nav-vendor-links">
              <button
                onClick={() => {
                  navigateTo('productos');
                }}
                className={`header__nav-link ${activeTab === "productos" || activeTab === "productos" ? "active" : ""}`}
              >
                Productos
              </button>
              <button
                onClick={() => {
                  navigateTo('pedidos');
                }}
                className={`header__nav-link ${activeTab === "pedidos" || activeTab === "pedidos" ? "active" : ""}`}
              >
                Pedidos
              </button>
            </div>
          )}

          {showCart && (
            <button
              className={`header__nav-link ${activeTab === "carrito" ? "active" : ""}`}
              onClick={() => {
                navigateTo('carrito');
              }}
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
            </button>
          )}

          {currentUser && (
            <button className={`header__nav-link ${activeTab === "notificaciones" ? "active" : ""}`}
              onClick={() => {
                navigateTo('notificaciones');
              }}>
                <NotificationBell />
            </button>
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