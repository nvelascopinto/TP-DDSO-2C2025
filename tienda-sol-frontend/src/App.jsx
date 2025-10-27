import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AppContext';
import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer.jsx';
import HomePage from './views/HomePage/HomePage.jsx';
import StorePage from './views/StorePage/StorePage.jsx';
import CartPage from './views/CartPage/CartPage.jsx';
import SellerDashboard from './views/SellerDashboard/SellerDashboard.jsx';
import NotificationsPage from './views/NotifiationPage/NotificationsPage.jsx';
import OrderHistoryPage from './views/OrderHistory/OrderHistoryPage.jsx';
import LoginPage from './views/LoginPage/LoginPage.jsx';
import RegisterPage from './views/RegisterPage/RegisterPage.jsx';
import './App.css';

// Componente interno que usa los hooks de routing
const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedStore, setSelectedStore] = useState(null);
  const { currentUser, login } = useAuth();

  // Obtener la ruta actual sin el "/"
  const currentRoute = location.pathname.slice(1) || 'home';

  const navigateTo = (newView, store) => {
    if (store) {
      setSelectedStore(store);
    }
    // Navegar usando React Router
    navigate(`/${newView === 'home' ? '' : newView}`);
  };

  const handleLogin = (userType) => {
    login(userType);
    if (userType === 'VENDEDOR') {
      navigate('/productos');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="app-container">
      <Header navigateTo={navigateTo} currentRoute={currentRoute} />
      <main className="main-content container">
        <Routes>
          {/* Ruta principal - Home */}
          <Route 
            path="/" 
            element={<HomePage onStoreSelect={(store) => navigateTo('tienda', store)} />} 
          />

          {/* Ruta de tienda */}
          <Route 
            path="/tienda" 
            element={
              selectedStore 
                ? <StorePage vendedor={selectedStore} />
                : <Navigate to="/" replace />
            } 
          />

          {/* Ruta del carrito */}
          <Route 
            path="/carrito" 
            element={<CartPage onLoginRequest={() => navigateTo('login')} navigateTo={navigateTo} />} 
          />

          {/* Dashboard del vendedor - protegida */}
          <Route 
            path="/productos" 
            element={
              currentUser?.tipo === 'VENDEDOR' 
                ? <SellerDashboard />
                : <Navigate to="/" replace />
            } 
          />

          {/* Pedidos del vendedor - protegida */}
          <Route 
            path="/pedidos" 
            element={
              currentUser?.tipo === 'VENDEDOR' 
                ? <SellerDashboard />
                : <Navigate to="/" replace />
            } 
          />

          {/* Notificaciones - requiere autenticación */}
          <Route 
            path="/notificaciones" 
            element={
              currentUser 
                ? <NotificationsPage navigateTo={() => navigateTo('home')} />
                : <Navigate to="/login" replace />
            } 
          />

          {/* Historial de pedidos - solo compradores */}
          <Route 
            path="/historial-pedidos" 
            element={
              currentUser?.tipo === 'COMPRADOR' 
                ? <OrderHistoryPage />
                : <Navigate to="/" replace />
            } 
          />

          {/* Login */}
          <Route 
            path="/login" 
            element={
              currentUser 
                ? <Navigate to="/" replace />
                : <LoginPage onLogin={handleLogin} />
            } 
          />

          {/* Registro */}
          <Route 
            path="/register" 
            element={
              currentUser 
                ? <Navigate to="/" replace />
                : <RegisterPage onRegister={handleLogin} />
            } 
          />

          {/* Ruta 404 - redirige al home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

// Componente principal con BrowserRouter
const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;