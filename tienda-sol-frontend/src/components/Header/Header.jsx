import React, { useState, useEffect } from 'react';
import { useAuth, useCart } from '../../contexts/AppContext.jsx';
import NotificationBell from '../NotificationBell/NotificationBell.jsx';
import './Header.css';
import logo from "../../assets/logo.svg";
import {Drawer } from 'antd';
import { Cart } from '../Cart/Cart.jsx';
import Button from "../Button/Button.jsx";

const Header = ({ navigateTo, currentRoute }) => {
  const { currentUser, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const cartItemCount = getCartItemCount();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
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
  
  

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleFinalizarCompra = () => {
    setIsProcessing(true);
    // Cerrar el drawer antes de navegar
    if (onClose) {
      onClose();
    }
    // Navegar a la página de carrito
    navigateTo('carrito');
    setIsProcessing(false);
  };

  return (
    <header className="header">
      <div className="header__container container">
       <div className = 'heder__home'>
        <div 
          className="header__logo"
          onClick={() => { 
            //if (currentUser?.tipo != 'Vendedor') {
              navigateTo('');
            //}
          }}
        >
          <img src={logo} alt="Logo Tienda Sol" className="header__logo-image" />
          <span className="header__logo-text">Tienda Sol</span>
          </div>
        </div>
        
        

        {/* menú hamburguesa*/}
        
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
          <Button
          className={`header__nav-link header__home-icon ${activeTab === "home" ? "active" : ""}`}
          onClick={() => handleNavigate("home")}>
            <span className="material-symbols-outlined">home</span>
            <span className="logo_inicio_title">Inicio</span>
          </Button>
          {currentUser?.tipo === 'Comprador' && (
              
            <button
              onClick={() => handleNavigate('historial-pedidos')}
              className={`header__nav-link ${activeTab === "historial-pedidos" ? "active" : ""}`}
            >
              Mis Pedidos
            </button>
          )}

          {currentUser?.tipo === 'Vendedor' && (
            <div className="header__nav-vendor-links">
              <button
                onClick={() => handleNavigate('productos')}
                className={`header__nav-link ${activeTab === "productos" ? "active" : ""}`}
              >
                Productos
              </button>
              <button
                onClick={() => handleNavigate('historial-pedidos')}
                className={`header__nav-link ${activeTab === "historial-pedidos" ? "active" : ""}`}
              >
                Pedidos
              </button>
            </div>
          )}

          {showCart && (
            <button
              className={`header__nav-link header__cart-icon ${activeTab === "carrito" ? "active" : ""}`}
              // onClick={() => handleNavigate('carrito')}
               onClick={showDrawer}
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
          <Drawer
                title="Carrito"
                closable={{ 'aria-label': 'Close Button' }}
                onClose={onClose}
                open={open}
                width={500}
              >
              <Cart handle={handleFinalizarCompra} onClose={onClose} isProcessing={isProcessing} navigateTo={navigateTo} />

          </Drawer>

          

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
                Hola, {currentUser.username.split(' ')[0]}
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
                Iniciar Sesión
              </button>

              <button
                onClick={() => handleNavigate('register')}
                className="header__register-button"
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