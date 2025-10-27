
import React, { useEffect, useState } from 'react';
import { api } from '../../services/mockService.js';
import Spinner from '../../components/Spinner/Spinner.jsx';
import './HomePage.css';

const HomePage = ({ onStoreSelect }) => {
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendedores = async () => {
      try {
        setLoading(true);
        const data = await api.getVendedores();
        setVendedores(data);
      } catch (error) {
        console.error("Error fetching vendedores:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVendedores();
  }, []);

  return (
    <div className="homepage">
      <div className="homepage__banner">
        <h1 className="homepage__banner-title">Bienvenido a Tienda Sol</h1>
        <p className="homepage__banner-subtitle">Explora nuestras tiendas y encuentra productos únicos.</p>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="homepage__store-grid">
          {vendedores.map((vendedor) => (
            <div
              key={vendedor.id}
              className="homepage__store-card"
              onClick={() => onStoreSelect(vendedor)}
            >
              <h2 className="store-card__title">{vendedor.nombre}</h2>
              <p className="store-card__cta">Ver catálogo</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
