import React, { useState } from 'react';
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
import './App.css';

const App = () => {
  // FIX: Changed initial view to 'home' to allow guest browsing.
  const [view, setView] = useState('home');
  const [selectedStore, setSelectedStore] = useState(null);

  const { currentUser, login } = useAuth();

  const navigateTo = (newView, store) => {
    setView(newView);
    if (store) {
      setSelectedStore(store);
    }
  };

  const handleLogin = (userType) => {
    login(userType);
    if (userType === 'VENDEDOR') {
      setView('dashboard');
    } else {
      setView('home');
    }
  };

  const renderView = () => {
    // FIX: Reworked rendering logic to support guest users and show login only when explicitly navigated to.
    if (!currentUser && view === 'login') {
      return <LoginPage onLogin={handleLogin} />;
    }

    switch (view) {
      case 'home':
        return <HomePage onStoreSelect={(store) => navigateTo('store', store)} />;
      case 'store':
        return selectedStore
          ? <StorePage vendedor={selectedStore} />
          : <HomePage onStoreSelect={(store) => navigateTo('store', store)} />;
      case 'cart':
        return <CartPage onLoginRequest={() => navigateTo('login')} navigateTo={navigateTo} />;
      case 'dashboard':
        return currentUser?.tipo === 'VENDEDOR'
          ? <SellerDashboard />
          : <HomePage onStoreSelect={(store) => navigateTo('store', store)} />;
      case 'notifications':
        return currentUser
          ? <NotificationsPage navigateTo={() => navigateTo('home')} />
          : <LoginPage onLogin={handleLogin} />;
      case 'orderHistory':
        return currentUser?.tipo === 'COMPRADOR'
          ? <OrderHistoryPage />
          : <HomePage onStoreSelect={(store) => navigateTo('store', store)} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      default:
        return <HomePage onStoreSelect={(store) => navigateTo('store', store)} />;
    }
  };

  return (
    <div className="app-container">
      {/* FIX: Header is now always rendered. */}
      <Header navigateTo={navigateTo} />
      <main className="main-content container">
        {renderView()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
