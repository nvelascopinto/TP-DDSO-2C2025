import React, { useEffect, useState } from 'react';
import ProductCard from '../../components/ProductCard/ProductCard.jsx';
import Spinner from '../../components/Spinner/Spinner.jsx';
import './StorePage.css';
import { getProductosByVendedor } from '../../services/productoService.js';
import {CATEGORIAS} from '../../../enums.js'
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {FiltrosStore} from '../../components/FiltrosStore/FiltrosStore.jsx';
import { Add, Remove } from '@mui/icons-material';

const StorePage = ({ vendedor }) => {
  // CAMBIO IMPORTANTE: Inicializa con null para detectar cuando no hay datos
  const [productos, setProductos] = useState(null);
  const [loading, setLoading] = useState(true);
    const [shouldFetch, setShouldFetch] = useState(true);
  
  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrecio, setMinPrecio] = useState('');
  const [maxPrecio, setMaxPrecio] = useState('');
  const [categoria, setCategoria] = useState('all');
  const [sortOrder, setSortOrder] = useState('masVendido');
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

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
    useEffect(() => {
  if (shouldFetch) {
    fetchProductos();
    setShouldFetch(false);
  }
}, [shouldFetch, searchTerm, minPrecio, maxPrecio, categoria, sortOrder, currentPage]);

  // CAMBIO IMPORTANTE: Acceso seguro a los datos
  const currentProducts = 
                         productos?._embedded?.productos ||
                         [];
  
  const totalPages = productos?.pagina?.totalPaginas ||  
                    1;

  // Resetear página si cambian filtros
  // useEffect(() => {
  //   setCurrentPage(1);
  // }, [searchTerm, minPrecio, maxPrecio, categoria, sortOrder]);

  // Limpiar todos los filtros
  const handleClearFilters = () => {
    setSearchTerm('');
    setMinPrecio('');
    setMaxPrecio('');
    setCategoria('all');
    setSortOrder('masVendido');
    setCurrentPage(1);
    setShouldFetch(true);
  };

  return (
    <div className="store-page" role="main" aria-labelledby="store-title">
      <div className='store-page__box'>
      <div className='store-page__header_box'>
          <div className="store-page__header">
            <h1 id="store-title" className="store-page__title">{vendedor.tienda?.nombre || vendedor.nombre}</h1>
          </div>

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
            <div className = 'search-icon-button'>
            <IconButton aria-label="search icon"
                        sx={{ color: 'white' }}
                        onClick={fetchProductos}>
              <SearchIcon 
                          
                          fontSize="large"
                          />
            </IconButton>
            </div>
        </div>
      </div>
      </div>
      <div className = "filters_and_products_box">
            
              <FiltrosStore 
                minPrecio={minPrecio}
                setMinPrecio={setMinPrecio}
                maxPrecio={maxPrecio}
                setMaxPrecio={setMaxPrecio}
                categoria={categoria}
                setCategoria={setCategoria}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                handleClearFilters={handleClearFilters}
                fetchProductos={fetchProductos}
              />
            
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
        </>
        )}
      </div>
      {!loading && (
        <>
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