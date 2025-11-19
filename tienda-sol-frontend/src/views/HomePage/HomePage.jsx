
import React, { useEffect, useState } from 'react';
import { api } from '../../services/mockService.js';
import Spinner from '../../components/Spinner/Spinner.jsx';
import './HomePage.css';
import { getTiendas } from '../../services/tiendaService.js';
import { TiendaCard } from '../../components/TiendaCard/TiendaCard.jsx';
import Skeleton from '@mui/material/Skeleton';

const HomePage = ({ onStoreSelect, currentUser, onError }) => {
  const [tiendas, setTiendas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTiendas = async () => {
      try {
        setLoading(true);
        const tiendas = await getTiendas()

        if (currentUser?.tipo === "Vendedor") {
          const tiendaVendedor = tiendas.filter(
            (tienda) => tienda.username === currentUser.username
          )
          setTiendas(tiendaVendedor);
        } else {
          setTiendas(tiendas);
        }
      } catch (error) {
        console.error("Error fetching tiendas:", error);
        if (onError) {
             
             const status = error.response?.status || 
                            (error.code === 'ERR_NETWORK' ? 'ERR_NET' : '500');

             const backendMessage = error.response?.data?.message || 
                                    error.response?.data?.error || 
                                    (error.response?.data ? JSON.stringify(error.response.data) : null);
             
             let message = 'Error en la comunicación con el servicio.';
             let details = 'No se pudieron cargar las tiendas. Por favor, verifica tu conexión a internet o intenta recargar la página.';

             if (backendMessage) {
                message = `Error ${status}: ${backendMessage.substring(0, 100)}`; 
             } else {
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

             onError({
                status: status, 
                message: message,
                details: details
            });
        }
        setTiendas([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTiendas();
  }, [currentUser]);

  return (
    <div className="homepage" role="main">
      <div className="homepage__banner"  aria-label="Encabezado de bienvenida">
        <h1 className="homepage__banner-title">Bienvenido a Tienda Sol</h1>
        <p className="homepage__banner-subtitle">Explora nuestras tiendas y encuentra productos únicos.</p>
      </div>

      {loading ? (
       
        <div className="homepage__store-grid" 
            role="status" 
            aria-label="Cargando tiendas disponibles"
            aria-busy="true"
            aria-live="polite">
          <Skeleton variant="rounded" width={300} height={150} />
          <Skeleton variant="rounded" width={300} height={150} />
          <Skeleton variant="rounded" width={300} height={150} />
          <Skeleton variant="rounded" width={300} height={150} />
          <Skeleton variant="rounded" width={300} height={150} />
          <Skeleton variant="rounded" width={300} height={150} />
        </div>
      ) : (
        <div className="homepage__store-grid" role="region" aria-label="Listado de tiendas disponibles"> 
          {tiendas
          .map((tienda) => (
            <TiendaCard
              key={tienda._id}
              vendedor={tienda}
              onStoreSelect={onStoreSelect}
            />
          ))}
          {tiendas.length === 0 && (
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
