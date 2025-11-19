import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth, useTienda } from './contexts/AppContext';
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
import { ConfigProvider } from 'antd';
import esES from 'antd/locale/es_ES';
import { CheckOut } from './views/CheckOut/CheckOut';
import { TipoUsuario } from '../enums';
import UserProfile from './views/userInfo/userInfo.jsx';



// Componente interno que usa los hooks de routing
const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedStore, setSelectedStore] = useState(null);
  const { currentUser, login, register } = useAuth();
  const [appError, setAppError] = useState(null);
  const {tienda} = useTienda();

  // Obtener la ruta actual sin el "/"
  const currentRoute = location.pathname.slice(1) || 'home';

const navigateTo = (newView, store) => {
  setAppError(null);
  if (store) {
    // CAMBIO: Usar el username/id de la tienda en la URL
    navigate(`/tienda/${store.username}`);
    return;
  }
  
  if (newView === "home" || newView === "" || newView === "/") {
    navigate('/');
  } else {
    navigate(`/${newView}`);
  }
};
  const handleError = (errorDetails) => {
    console.error("Error capturado para navegación:", errorDetails);
    // Establecemos el error en el estado global
    setAppError(errorDetails);
    
    // Redirigimos a la ruta de error, pasando los detalles del error en el "state"
    navigate('/error', { state: { error: errorDetails } });
  };


  const handleLogin = (tipo, user, password) => {
  return login(user, password)
   .then(({ user: userData, tienda: tiendaData }) => {
      
      // if (((userData.tipo == TipoUsuario.VENDEDOR) && tiendaData != null)) {
      //  console.log("Usuario logueado:"+ tiendaData.nombre);

      //   navigate('/tienda', { state: { tienda: tiendaData } });
        
      // } else if (userData.tipo == TipoUsuario.COMPRADOR) {
      //   navigate('/');
      // }
      navigate('/');
      
      return userData;
    })
    .catch((error) => {
      // Si no hay respuesta del servidor (error de red)
      if (!error.response) {
        navigate('/error');
        throw error; // Propagar para que lo agarre el siguiente catch
      }
      
      // Si es error 500+
      if (error.response.status >= 500) {
        navigate('/error', {
          state: { status: error.response.status }
        });
        throw error;
      }
      
      // Cualquier otro error (400, 401, 403, etc.)
      throw error; // Propagar para el formulario
    });
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
          <Route 
            path="/" 
            element={<HomePage onStoreSelect={(store) => navigateTo('tienda', store)} currentUser={currentUser}/>} 
          />

          <Route 
            path="/error" 
            element={<ErrorPage />}
          />

          <Route 
            path="/tienda/:vendedorUsername" 
            element={
              
                 <StorePage />
               
            } 
          />

          <Route 
            path="/checkout" 
            element={ <CheckOut navigateTo={navigateTo}  />
            } 
          />

          <Route 
            path="/carrito" 
            element={<CarritoPage onLoginRequest={() => navigateTo('login')} navigateTo={navigateTo} />} 
          />

          <Route 
            path="/productos" 
            element={
              currentUser?.tipo === 'Vendedor' 
                ? <SellerDashboard />
                : <Navigate to="/" replace />
            } 
          />

          <Route 
            path="/notificaciones" 
            element={
              currentUser 
                ? <NotificationsPage navigateTo={navigateTo} />
                : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/user" 
            element={
              currentUser 
                ? <UserProfile  navigateTo={navigateTo}/>
                : <Navigate to="/login" replace />
            } 
          />

          <Route 
            path="/historial-pedidos" 
            element={
              currentUser
                ? <OrderHistoryPage navigateTo={navigateTo} />
                : <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/historial-pedidos/:numero" 
            element={
              currentUser
                ? <DetailsPedido navigateTo={navigateTo}/>
                : <Navigate to="/" replace />
            } 
          />

          <Route 
            path="/notificaciones/:numero" 
            element={
              currentUser
                ? <DetailsPedido navigateTo={navigateTo}/>
                : <Navigate to="/" replace />
            } 
          />

          <Route 
            path="/login" 
            element={
              currentUser 
                ? <Navigate to="/" replace />
                : <LoginPage onLogin={handleLogin} />
            } 
          />

          <Route 
            path="/register" 
            element={
              currentUser 
                ? <Navigate to="/" replace />
                : <RegisterPage onRegister={handleRegister} />
            } 
          />

          <Route path="*" element={<Navigate to="/error" replace state={{ error: { status: '404', message: 'Página no encontrada', details: 'Parece que la URL que buscabas no existe. No te preocupes, puedes volver al inicio.' } }} />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  const isMobile = window.innerWidth < 768;
  return (
    <ConfigProvider
      locale={esES}
      theme={{
        token: {
          colorPrimary: '#3E1917', // Cambia estos valores a tus colores
          colorPrimaryHover: '#5A2523',
          colorLink: '#3E1917',
        },
        components: {
          Input: {
            controlHeight: isMobile ? 36 : 40,
            fontSize: isMobile ? 14 : 16,
            colorBorder: '#3E1917',
            activeBorderColor: '#3E1917',
            hoverBorderColor: '#5A2523',
            activeShadow: '0 0 0 3px rgba(110, 36, 32, 0.1)',
            paddingBlock: 4
          },
          Button: {
            colorPrimary: '#75162D',
            colorPrimaryHover: '#5A2523',
          },
          Slider: {
            handleLineWidth: 2, 
            railSize : 3
          } 
        },
      }}
    >
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;