import React, { useState, useEffect } from 'react';
import { useAuth, useCart } from '../../contexts/AppContext.jsx';
import NotificationBell from '../NotificationBell/NotificationBell.jsx';
import './Header.css';
import logo from "../../assets/logo.svg";
import {Drawer } from 'antd';
import { Cart } from '../Cart/Cart.jsx';
import Button from "../Button/Button.jsx";
import { TipoUsuario } from '../../../enums.js';

const Header = ({ navigateTo, currentRoute }) => {
  const { currentUser, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const cartItemCount = getCartItemCount();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // Detectar cambios en el tamaño de la pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    console.log("CURRENT USER" + currentUser.tipo)
    if(currentUser.tipo == TipoUsuario.VENDEDOR) {
      navigateTo('login');
    }
     if(currentUser.tipo == TipoUsuario.COMPRADOR) {
      navigateTo('home');
    }
    
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
      if (currentUser?.tipo === "Comprador") {
        setActiveTab("");
      } else if (currentUser?.tipo === "Vendedor") {
        setActiveTab("productos");
      }
    }
  }, [currentUser, currentRoute]);

  // cerrar menú con click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.header__nav') && !event.target.closest('.header__hamburger')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const showCart = currentUser?.tipo !== 'Vendedor';
  
  const handleCartClick = () => {
    if (isMobile) {
      // En móvil, navegar directamente al carrito
      handleNavigate('carrito');
    } else {
      // En desktop, mostrar el drawer
      showDrawer();
    }
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleFinalizarCompra = () => {
    setIsProcessing(true);
    if (onClose) {
      onClose();
    }
    navigateTo('carrito');
    setIsProcessing(false);
  };

   return (
    <header className="header" role="banner">
      <div className="header__container container">
        <div className='heder__home'>
          <div 
            className="header__logo"
            onClick={() => { navigateTo('home'); }}
            role="button"
            tabIndex={0}
            aria-label="Ir al inicio"
          >
            <img src={logo} alt="Logo Tienda Sol" className="header__logo-image" />
            <span className="header__logo-text">Tienda Sol</span>
          </div>
        </div>

        {/* menú hamburguesa */}
        <button 
          className="header__hamburger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Abrir o cerrar menú"
          aria-expanded={isMenuOpen}
          aria-controls="main-navigation"
        >
          <span className={`header__hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`header__hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`header__hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
        </button>

        <nav 
          id="main-navigation"
          className={`header__nav ${isMenuOpen ? 'open' : ''}`}
          role="navigation"
          aria-label="Menú principal"
        >
          <div className='button_home'>
            <button
              className={`header__nav-link header__home-icon ${activeTab === "home" ? "active" : ""}`}
              onClick={() => handleNavigate("home")}
              aria-label="Ir al inicio"
            >
              <span className="material-symbols-outlined">home</span>
              <span className="header__nav-text">Inicio</span>
            </button>
          </div>

          {currentUser?.tipo === 'Comprador' && (
            <button
              onClick={() => handleNavigate('historial-pedidos')}
              className={`header__nav-link ${activeTab === "historial-pedidos" ? "active" : ""}`}
              aria-label="Ver historial de pedidos"
            >
              Mis Pedidos
            </button>
          )}

          {currentUser?.tipo === 'Vendedor' && (
            <div className="header__nav-vendor-links">
              <button
                onClick={() => handleNavigate('productos')}
                className={`header__nav-link ${activeTab === "productos" ? "active" : ""}`}
                aria-label="Ver productos"
              >
                Productos
              </button>
              <button
                onClick={() => handleNavigate('historial-pedidos')}
                className={`header__nav-link ${activeTab === "historial-pedidos" ? "active" : ""}`}
                aria-label="Ver pedidos"
              >
                Pedidos
              </button>
            </div>
          )}

          {showCart && (
            <button
              className={`header__nav-link header__cart-icon ${activeTab === "carrito" ? "active" : ""}`}
              onClick={handleCartClick}
              aria-label="Abrir carrito"
              aria-haspopup="dialog"
            >
              <span className="material-symbols-outlined">
                shopping_cart_checkout
              </span>
              <span className="header__nav-text">Carrito</span>
              {cartItemCount > 0 && (
                <span 
                  key={cartItemCount} 
                  className="header__cart-badge"
                  aria-label={`${cartItemCount} artículos en el carrito`}
                >
                  {cartItemCount}
                </span>
              )}
            </button>
          )}

          {!isMobile && (
            <Drawer
              title="Carrito"
              closable={{ 'aria-label': 'Cerrar' }}
              onClose={onClose}
              open={open}
              width={500}
              aria-label="Carrito lateral"
              role="dialog"
            >
              <Cart 
                handle={handleFinalizarCompra} 
                onClose={onClose} 
                isProcessing={isProcessing} 
                navigateTo={navigateTo} 
              />
            </Drawer>
          )}

          {currentUser && (
            <>
              <button
                className={`header__nav-link header__notification-icon  ${activeTab === "notificaciones" ? "active" : ""}`}
                onClick={() => handleNavigate('notificaciones')}
                aria-label="Ver notificaciones"
              >
                <span className="header__nav-text">Notificaciones</span>
                <NotificationBell />
              </button>

              <button
                className={`header__nav-link header__profile-icon ${activeTab === "user" ? "active" : ""}`}
                onClick={() => handleNavigate('user')}
                aria-label="Mi perfil"
              >
                <span className="material-symbols-outlined">
                  account_circle
                </span>
                <span className="header__nav-text">Mi Perfil</span>
              </button>
            </>
          )}

          {currentUser ? (
            <div className="header__user-info">
              <button 
                onClick={handleLogout} 
                className="header__logout-button"
                aria-label="Cerrar sesión"
              >
                Salir
              </button>
            </div>
          ) : (
            <div className="header__user-info">
              <button 
                onClick={() => handleNavigate('login')}
                className="header__login-button"
                aria-label="Iniciar sesión"
              >
                Iniciar Sesión
              </button>

              <button
                onClick={() => handleNavigate('register')}
                className="header__register-button"
                aria-label="Crear cuenta"
              >
                CREAR CUENTA
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;