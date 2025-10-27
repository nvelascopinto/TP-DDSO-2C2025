// FIX: Replaced placeholder content with a valid React application entry point.
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/App.jsx';
import { AppProvider } from './src/contexts/AppContext.jsx';
import './styles.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);