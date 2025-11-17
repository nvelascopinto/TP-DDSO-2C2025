
import React, { createContext, useState, useContext, useCallback, useEffect} from 'react';
import { TipoUsuario } from '/enums';
import Toast from '../components/Toast/Toast';
import { getPedidos } from '../services/userService.js';
import {authenticate} from '../services/userService.js'
import { getTiendaByVendedor } from '../services/tiendaService';


// usuarios
//const mockComprador = { id: 'user-1', nombre: 'Ana (Compradora)', email: 'ana@example.com', telefono: '123456789', tipo: TipoUsuario.COMPRADOR, fechaAlta: new Date().toISOString() };
//const mockVendedor = { id: 'user-2', nombre: 'Boutique de Ropa "Estilo Urbano"', email: 'estilo@example.com', telefono: '987654321', tipo: TipoUsuario.VENDEDOR, fechaAlta: new Date().toISOString() };

// contextos
const AuthContext = createContext(undefined);
const CartContext = createContext(undefined);
const PedidosContext = createContext(undefined);
const TiendaContext = createContext(undefined)
// providers
export const AppProvider = ({ children }) => {
  
    

  const [currentUser, setCurrentUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [tienda, setTienda] = useState(null);

  // Cargar usuario Y carrito al montar
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const storedTienda = localStorage.getItem('tienda');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    if (storedTienda) {
      setTienda(JSON.parse(storedTienda));
    }


    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
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
   useEffect(() => {
    if (tienda) {
      
      localStorage.setItem('tienda', JSON.stringify(tienda));
    } else {
     
      localStorage.removeItem('tienda');
    }
  }, [tienda]);

  // Guardar carrito cada vez que cambia
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } else {
      localStorage.removeItem('cartItems');
    }
  }, [cartItems]);
  
const login =(username, password) =>  {
  return authenticate(username, password)
    .then((user) => {
      setCurrentUser(user);
      if(user.tipo == TipoUsuario.VENDEDOR){
        return getTiendaByVendedor(user.username).then((tienda) => {
         setTienda(tienda)
          return {user, tienda}; // Retornar ambos
       })
      }
           return { user, tienda: null}; // Retornar ambos
      
      
    })
    .catch((error) => {
      console.error("Error al autenticarse:", error);
      throw error; 
    });
};


   const register = (user) => {
  
      setCurrentUser(user)
      if(user.tipo == TipoUsuario.VENDEDOR){
        getTiendaByVendedor(user.username).then((tienda) => {
         setTienda(tienda)
       })
      }
  };

  const logout = useCallback(() => {
    setCurrentUser(null);
    setCartItems([]); 
    setTienda(null);
    const storedTienda = localStorage.getItem('tienda');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('cartItems');
    if(storedTienda){
      localStorage.removeItem('tienda')
    }

  }, []);

  
  const showToast = useCallback((message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  
  const addToCart = useCallback((producto) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.producto._id === producto._id);
      if (existingItem) {
        return prevItems.map(item =>
          item.producto._id === producto._id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prevItems, { producto, cantidad: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productoId) => {
    setCartItems(prevItems => prevItems.filter(item => item.producto._id !== productoId));
  }, []);

  const updateQuantity = useCallback((productoId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productoId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.producto._id === productoId ? { ...item, cantidad: quantity } : item
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

    if (!currentUser) return 
    getPedidos(currentUser.username)
      .then(data => {
        console.log(data)
        let userPedidos = [];
        if(currentUser.tipo === TipoUsuario.VENDEDOR) {
          userPedidos = data.filter(p => p.vendedor === currentUser.username);
          
          
        }else if(currentUser.tipo === TipoUsuario.COMPRADOR) {
          userPedidos = data.filter(p => p.comprador === currentUser.username);
          
        }
        setPedidos(userPedidos);
      })
      .catch(error => {
        console.error("Error buscando pedidos:", error);
      });
  }, [currentUser]);

  const updatePedido = useCallback((pedidoActualizado) => {
    setPedidos(prev =>
      prev.map(p => (p._id === pedidoActualizado._id ? pedidoActualizado : p))
    );
  }, []);
  return (
    <AuthContext.Provider value={{ currentUser, login, logout, register }}>
      <TiendaContext.Provider value={{tienda}}>
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
      </TiendaContext.Provider>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AppProvider');
  }
  return context;
};
export const useTienda = () => {
  const context = useContext(TiendaContext);
  if (context === undefined) {
    throw new Error('useTienda must be used within an AppProvider');
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
