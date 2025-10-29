
import React, { useEffect, useState } from 'react';
import { api } from '../../services/mockService.js';
import Spinner from '../../components/Spinner/Spinner.jsx';
import './HomePage.css';
import { getVendedores } from '../../services/userService.js';

const HomePage = ({ onStoreSelect, onError }) => {
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendedores = async () => {
      try {
        setLoading(true);
        const data = await getVendedores();
        setVendedores(data);
      } catch (error) {
        console.error("Error fetching vendedores:", error);
      // Reportar el error al componente padre para que navegue
        if (onError) {
             
             // 1. Determinar el estado (código) del error
             const status = error.response?.status || 
                            (error.code === 'ERR_NETWORK' ? 'ERR_NET' : '500');

             // 2. Intentar obtener el mensaje detallado del backend
             // El mensaje del backend puede estar en error.response.data.message, error.response.data.error, o ser el cuerpo de respuesta
             const backendMessage = error.response?.data?.message || 
                                    error.response?.data?.error || 
                                    (error.response?.data ? JSON.stringify(error.response.data) : null);
             
             let message = 'Error en la comunicación con el servicio.';
             let details = 'No se pudieron cargar las tiendas. Por favor, verifica tu conexión a internet o intenta recargar la página.';

             // Si tenemos un mensaje del backend, lo usamos como mensaje principal y detallado
             if (backendMessage) {
                message = `Error ${status}: ${backendMessage.substring(0, 100)}`; // Usar el mensaje del backend
                details = backendMessage;
             } else {
                 // Si NO hay mensaje del backend, usamos el mensaje genérico basado en el status
                 switch (status) {
                    case 404:
                        message = 'Recurso No Encontrado (404)';
                        details = 'El listado de tiendas o el endpoint de la API no se encuentra disponible.';
                        break;
                    case 500:
                        message = 'Error Interno del Servidor (500)';
                        details = 'Ocurrió un fallo inesperado en el servidor.';
                        break;
                    case 'ERR_NET':
                        message = 'Fallo de Conexión';
                        details = 'Parece que no hay conexión a internet o el servidor no responde.';
                        break;
                    default:
                        message = `Error ${status} Desconocido`;
                        details = `Ocurrió un error inesperado al cargar los datos. Mensaje de librería: ${error.message}`;
                 }
             }

             // Llamar a onError para que el router navegue a ErrorPage
             onError({
                status: status, 
                message: message,
                details: details
            });
        }
        setVendedores([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVendedores();
  }, []);

  return (
    <div className="homepage" role="main">
      <div className="homepage__banner"  aria-label="Encabezado de bienvenida">
        <h1 className="homepage__banner-title">Bienvenido a Tienda Sol</h1>
        <p className="homepage__banner-subtitle">Explora nuestras tiendas y encuentra productos únicos.</p>
      </div>

      {loading ? (
        <Spinner  role="status"
          aria-busy="true"
          aria-live="polite"
          aria-label="Cargando tiendas disponibles"/>
      ) : (
        <div className="homepage__store-grid" role="region" aria-label="Listado de tiendas disponibles"> 
          {vendedores.filter(v => v.tienda)
          .map((vendedor) => (
            <div
              key={vendedor.username}
              className="homepage__store-card"
              role="button"
              aria-label={'Abrir catálogo de la tienda' + vendedor.tienda.nombre}
              onClick={() => onStoreSelect(vendedor)}
            >
              <h2 className="store-card__title">{vendedor.tienda.nombre}</h2>
              <p className="store-card__cta">Ver catálogo</p>
            </div>
          ))}
          {vendedores.length === 0 && (
            <p className="homepage__no-stores" role="alert" aria-live="assertive">
              No se encontraron tiendas disponibles en este momento.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
