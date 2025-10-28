
import React, { createContext, useState, useContext, useCallback, useEffect} from 'react';
import { TipoUsuario } from '@/enums';
import Toast from '../components/Toast/Toast';
import {api} from '../services/mockService.js'
import {authenticate} from '../services/userService.js'


// --- MOCK USERS FOR LOGIN ---
const mockComprador = { id: 'user-1', nombre: 'Ana (Compradora)', email: 'ana@example.com', telefono: '123456789', tipo: TipoUsuario.COMPRADOR, fechaAlta: new Date().toISOString() };
const mockVendedor = { id: 'user-2', nombre: 'Boutique de Ropa "Estilo Urbano"', email: 'estilo@example.com', telefono: '987654321', tipo: TipoUsuario.VENDEDOR, fechaAlta: new Date().toISOString() };

// --- CONTEXTS ---
const AuthContext = createContext(undefined);
const CartContext = createContext(undefined);
const PedidosContext = createContext(undefined);

// --- APP PROVIDER ---
export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const [pedidos, setPedidos] = useState([]);

    // Cargar usuario guardado al montar (para que no se pierda al refresh)
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // Guardar usuario cada vez que cambia
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);
    // Guardar carrito cada vez que cambia
    useEffect(() => {
    if (cartItems.length > 0) localStorage.setItem('cartItems', JSON.stringify(cartItems));
    else localStorage.removeItem('cartItems');
  }, [cartItems]);

  // Auth methods

  const login = (user, passwrord) => {
    return authenticate(user, password).then((user) => {
      setCurrentUser(user)
    }).catch((error) => {
      console.log("Ocurrio un error al autenticarse")
      throw error
    })
  };

   const register = (user) => {
  
      setCurrentUser(user)
    
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Toast method
  const showToast = useCallback((message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
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

  const getPedidosUser = useCallback(() => {
    if (!currentUser) return;
    api.getPedidos()
      .then(data => {
        console.log(data)
        let userPedidos = [];
        if(currentUser.tipo === TipoUsuario.VENDEDOR) {
          userPedidos = data.filter(p => p.vendedorId === currentUser.id);
          
          
        }else if(currentUser.tipo === TipoUsuario.COMPRADOR) {
          userPedidos = data.filter(p => p.compradorId === currentUser.id);
          
        }
        setPedidos(userPedidos);
      })
      .catch(error => {
        console.error("Error fetching pedidos:", error);
      });
  }, [currentUser]);

  const updatePedido = useCallback((pedidoActualizado) => {
    setPedidos(prev =>
      prev.map(p => (p.id === pedidoActualizado.id ? pedidoActualizado : p))
    );
  }, []);
  return (
    <AuthContext.Provider value={{ currentUser, login, logout, register }}>
      <CartContext.Provider
        value={{
          cartItems,
          addToCart,
          removeFromCart,
          updateQuantity,
          clearCart,
          getCartTotal,
          getCartItemCount,
          toastMessage,
          showToast,
        }}
      >
        <PedidosContext.Provider value={{ pedidos, setPedidos, getPedidosUser , updatePedido}}>
          {children}
        </PedidosContext.Provider>

        {toastMessage && <Toast message={toastMessage} />}
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

export const usePedidos= () => {
  const context = useContext(PedidosContext);
  if (context === undefined) {
    throw new Error('usePedido must be used within an AppProvider');
  }
  return context;
};
