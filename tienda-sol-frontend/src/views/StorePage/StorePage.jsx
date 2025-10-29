import React, { useEffect, useState } from 'react';
import ProductCard from '../../components/ProductCard/ProductCard.jsx';
import Spinner from '../../components/Spinner/Spinner.jsx';
import './StorePage.css';
import { getProductosByVendedor } from '../../services/productoService.js';
import {CATEGORIAS} from '../../../enums.js'


const StorePage = ({ vendedor }) => {
  // CAMBIO IMPORTANTE: Inicializa con null para detectar cuando no hay datos
  const [productos, setProductos] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrecio, setMinPrecio] = useState('');
  const [maxPrecio, setMaxPrecio] = useState('');
  const [categoria, setCategoria] = useState('all');
  const [sortOrder, setSortOrder] = useState('masVendido');
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const filters = {
          vendedor: vendedor.username,
          pagina: currentPage,
          limite: productsPerPage,
        };

        // Agregar orden
        if (sortOrder && sortOrder !== 'masVendido') {
          filters.orden = sortOrder;
        } else if (sortOrder === 'masVendido') {
          filters.orden = 'masVendido';
        }

        // Agregar categoría
        if (categoria !== 'all') {
          filters.categoria = categoria;
        }

        // Agregar búsqueda por titulo
        if (searchTerm.trim()) {
          filters.titulo = searchTerm.trim();
        }

        // Agregar precio mínimo
        if (minPrecio.trim() && !isNaN(minPrecio)) {
          filters.minPrecio = parseFloat(minPrecio);
        }

        // Agregar precio máximo
        if (maxPrecio.trim() && !isNaN(maxPrecio)) {
          filters.maxPrecio = parseFloat(maxPrecio);
        }

        const data = await getProductosByVendedor(filters);
        console.log('Respuesta del backend:', data); // Para debug
        setProductos(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        // En caso de error, establece un objeto vacío para evitar crashes
        setProductos({ _embedded: { producto: [] }, pagina: { } });
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, [vendedor.username, searchTerm, minPrecio, maxPrecio, categoria, sortOrder, currentPage]);

  // CAMBIO IMPORTANTE: Acceso seguro a los datos
  const currentProducts = 
                         productos?._embedded?.productos ||
                         [];
  
  const totalPages = productos?.pagina?.totalPaginas ||  
                    1;

  // Resetear página si cambian filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, minPrecio, maxPrecio, categoria, sortOrder]);

  // Limpiar todos los filtros
  const handleClearFilters = () => {
    setSearchTerm('');
    setMinPrecio('');
    setMaxPrecio('');
    setCategoria('all');
    setSortOrder('masVendido');
    setCurrentPage(1);
  };

  return (
    <div className="store-page" role="main" aria-labelledby="store-title">
      <div className="store-page__header">
        <h1 id="store-title" className="store-page__title">{vendedor.tienda?.nombre || vendedor.nombre}</h1>
        <p className="store-page__subtitle">Nuestro catálogo de productos</p>
      </div>

      {/* Barra de búsqueda principal */}
      <div className="store-page__search-bar">
        <input
          type="text"
          id="titulo"
          placeholder="Buscar por titulo del producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          aria-label="Buscar productos por titulo"
        />
      </div>

      {/* Panel de filtros avanzados */}
      <div className="store-page__filters-panel" role="search" aria-label="Panel de filtros avanzados">
        <h3 className="filters-panel__title">Filtros</h3>
        
        <div className="filters-panel__grid">
          {/* Filtro de Precio Mínimo */}
          <div className="filter-group">
            <label htmlFor="minPrecioFilter" className="filter-label">Precio Mínimo</label>
            <input
              type="number"
              id="minPrecioFilter"
              placeholder="$ 0"
              value={minPrecio}
              onChange={(e) => setMinPrecio(e.target.value)}
              className="filter-input"
              min="0"
              step="0.01"
            />
          </div>

          {/* Filtro de Precio Máximo */}
          <div className="filter-group">
            <label htmlFor="maxPrecioFilter" className="filter-label">Precio Máximo</label>
            <input
              type="number"
              id="maxPrecioFilter"
              placeholder="$ 999999"
              value={maxPrecio}
              onChange={(e) => setMaxPrecio(e.target.value)}
              className="filter-input"
              min="0"
              step="0.01"
            />
          </div>

          {/* Filtro de Categoría */}
          <div className="filter-group">
            <label htmlFor="categoriaFilter" className="filter-label">Categoría</label>
            <select
              id="categoriaFilter"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="filter-select"
            >
              <option value="all">Todas las categorías</option>
              {Object.entries(CATEGORIAS).map(([key, value]) => (
                                      <option key={key} value={key}>{value}</option>
                                  ))}
            </select>
          </div>

          {/* Filtro de Ordenamiento */}
          <div className="filter-group">
            <label htmlFor="ordenFilter" className="filter-label">Ordenar por</label>
            <select
              id="ordenFilter"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="filter-select"
            >
              <option value="masVendido">Más vendidos</option>
              <option value="asc">Precio: Menor a Mayor</option>
              <option value="desc">Precio: Mayor a Menor</option>
            </select>
          </div>
        </div>

        {/* Botón para limpiar filtros */}
        <button 
          onClick={handleClearFilters}
          className="filters-panel__clear-btn"
          aria-label="Limpiar todos los filtros"
        >
          Limpiar filtros
        </button>
      </div>

      {/* Grid de productos */}
      {loading ? (
        <Spinner role="status" aria-live="polite" aria-label="Cargando productos"/>
      ) : (
        <>
          {currentProducts.length > 0 ? (
            <div className="store-page__product-grid" role="grid" aria-label="Lista de productos disponibles">
              {currentProducts.map((producto) => (
                <ProductCard 
                  key={producto._id} 
                  role="gridcell"
                  aria-label={`Producto ${producto.titulo}, precio ${producto.precio} pesos`} 
                  producto={producto} 
                />
              ))}
            </div>
          ) : (
            <div className="store-page__no-results">
              <p>No se encontraron productos con los filtros seleccionados.</p>
            </div>
          )}
      
          {/* Controles de paginación */}
          {totalPages > 1 && (
            <div className="pagination" role="navigation" aria-label="Controles de paginación de productos">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                aria-label="Ir a la página anterior"
                className="pagination__button"
              >
                Anterior
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`pagination__button ${currentPage === i + 1 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(i + 1)}
                  aria-current={currentPage === i + 1 ? 'page' : undefined}
                  aria-label={`Ir a la página ${i + 1}`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                aria-label="Ir a la página siguiente"
                className="pagination__button"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StorePage;