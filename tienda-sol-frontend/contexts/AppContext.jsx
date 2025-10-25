
import React, { createContext, useState, useContext, useCallback } from 'react';
import { TipoUsuario } from '@/enums';

// --- MOCK USERS FOR LOGIN ---
const mockComprador = { id: 'user-1', nombre: 'Ana (Compradora)', email: 'ana@example.com', telefono: '123456789', tipo: TipoUsuario.COMPRADOR, fechaAlta: new Date().toISOString() };
const mockVendedor = { id: 'user-2', nombre: 'Boutique de Ropa "Estilo Urbano"', email: 'estilo@example.com', telefono: '987654321', tipo: TipoUsuario.VENDEDOR, fechaAlta: new Date().toISOString() };

// --- CONTEXTS ---
const AuthContext = createContext(undefined);
const CartContext = createContext(undefined);

// --- APP PROVIDER ---
export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  // Auth methods
  const login = (userType) => {
    if (userType === TipoUsuario.COMPRADOR) {
      setCurrentUser(mockComprador);
    } else if (userType === TipoUsuario.VENDEDOR) {
      setCurrentUser(mockVendedor);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Toast method
  const showToast = useCallback((message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000); // Toast disappears after 3 seconds
  }, []);

  // Cart methods
  const addToCart = useCallback((producto) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.producto.id === producto.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prevItems, { producto, cantidad: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productoId) => {
    setCartItems(prevItems => prevItems.filter(item => item.producto.id !== productoId));
  }, []);

  const updateQuantity = useCallback((productoId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productoId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.producto.id === productoId ? { ...item, cantidad: quantity } : item
        )
      );
    }
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);
  
  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.producto.precio * item.cantidad, 0);
  }, [cartItems]);

  const getCartItemCount = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.cantidad, 0);
  }, [cartItems]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartItemCount, toastMessage, showToast }}>
        {children}
      </CartContext.Provider>
    </AuthContext.Provider>
  );
};

// --- HOOKS ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AppProvider');
  }
  return context;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within an AppProvider');
  }
  return context;
};
