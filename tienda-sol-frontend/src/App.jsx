import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AppContext';
import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer.jsx';
import HomePage from './views/HomePage/HomePage.jsx';
import StorePage from './views/StorePage/StorePage.jsx';
import CarritoPage from './views/CarritoPage/CarritoPage.jsx';
import SellerDashboard from './views/SellerDashboard/SellerDashboard.jsx';
import NotificationsPage from './views/NotifiationPage/NotificationsPage.jsx';
import OrderHistoryPage from './views/OrderHistory/OrderHistoryPage.jsx';
import LoginPage from './views/LoginPage/LoginPage.jsx';
import RegisterPage from './views/RegisterPage/RegisterPage.jsx';
import './App.css';
import DetailsPedido from './views/DetailsPedido/DetailsPedido.jsx';
import ErrorPage from './views/Errors/Errors';
import { authenticate, registerUser } from './services/userService.js';


// Componente interno que usa los hooks de routing
const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedStore, setSelectedStore] = useState(null);
  const { currentUser, login, register } = useAuth();
  const [appError, setAppError] = useState(null);

  // Obtener la ruta actual sin el "/"
  const currentRoute = location.pathname.slice(1) || 'home';

  const navigateTo = (newView, store) => {
    setAppError(null);
    if (store) {
      setSelectedStore(store);
    }
    // Navegar usando React Router
    navigate(`/${newView === 'home' ? '' : newView}`);
  };

  const handleError = (errorDetails) => {
    console.error("Error capturado para navegación:", errorDetails);
    // Establecemos el error en el estado global
    setAppError(errorDetails);
    
    // Redirigimos a la ruta de error, pasando los detalles del error en el 'state'
    navigate('/error', { state: { error: errorDetails } });
  };


  const handleLogin = (tipo, user, password) => {
    login(user, password)
    //.then((() => {
    //     if (tipo === 'Vendedor') {
    //      navigate('/productos');
    //     } else {
    //     navigate('/');
    //     }
    // })).catch((error) =>{
    //   if(!error.response) {
    //       navigate('/error')
    //   } else {    login(user, password)
      .then((userData) => {
        // userData es el usuario devuelto por el backend después del login
        console.log('Usuario logueado:', userData); // Debug
      
        // Navegar según el tipo de usuario devuelto por el backend
if (userData?.tipo === 'Vendedor') {
          navigate('/productos');
        } else {
          navigate('/');
        }
      })
      .catch((error) => {
        if (!error.response) {
          navigate('/error');
        } else {
          if (error.response.status >= 500 && error.response.status < 600) { // Corregí el operador
            navigate('/error', {
              state: {
                status: error.response.status
              }
            });
          } else {
          throw error
        }
      }
    })
  };

  const handleRegister = (tipoUsuario, userData) => {
  const payload = { ...userData, tipo: tipoUsuario }

  return registerUser(payload)
    .then((result) => {
      if (result?.error) {
        return { error: result.error };
      }
      register(result)
      navigate('/login'); // cambiar: que me mande a la página que me corresponde
    })
    .catch((error) => {
      if (!error.response) {
        navigate('/error');
      } else {
        if (error.response.status >= 500 && error.response.status < 600) {
          navigate('/error', {
            state: {
              status: error.response.status,
            },
          });
        } else {
          throw error; 
        }
      }
    });
};

  return (
    <div className="app-container">
      <Header navigateTo= {navigateTo} currentRoute={currentRoute} />
      <main className="main-content container">
        <Routes>
          {/* Ruta principal - Home */}
          <Route 
            path="/" 
            element={<HomePage onStoreSelect={(store) => navigateTo('tienda', store)} />} 
          />

           {/* Ruta de error general */}
          <Route 
            path="/error" 
            element={<ErrorPage />}
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
            element={<CarritoPage onLoginRequest={() => navigateTo('login')} navigateTo={navigateTo} />} 
          />

          {/* Dashboard del vendedor - protegida */}
          <Route 
            path="/productos" 
            element={
              currentUser?.tipo === 'Vendedor' 
                ? <SellerDashboard />
                : <Navigate to="/" replace />
            } 
          />

          {/* Pedidos del vendedor - protegida */}
          <Route 
            path="/pedidos" 
            element={
             
                 <OrderHistoryPage />
                
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
              currentUser?.tipo === 'Comprador' 
                ? <OrderHistoryPage navigateTo={navigateTo} />
                : <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/historial-pedidos/:id" 
            element={
              currentUser?.tipo === 'Comprador' 
                ? <DetailsPedido />
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
                : <RegisterPage onRegister={handleRegister} />
            } 
          />

          {/* Ruta 404 - redirige al home */}
          <Route path="*" element={<Navigate to="/error" replace state={{ error: { status: '404', message: 'Página no encontrada', details: 'Parece que la URL que buscabas no existe. No te preocupes, puedes volver al inicio.' } }} />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;