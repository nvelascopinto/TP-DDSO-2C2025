import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
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
import { AudioOutlined } from '@ant-design/icons';
import { Input, Space } from 'antd';
const { Search } = Input;
import { Pagination } from 'antd';

const StorePage = () => {
  
  const [productos, setProductos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shouldFetch, setShouldFetch] = useState(true);
  const location = useLocation();
  const tienda = location.state?.tienda;
  console.log(tienda)

  const [searchTerm, setSearchTerm] = useState('');
  const [minPrecio, setMinPrecio] = useState('');
  const [maxPrecio, setMaxPrecio] = useState('');
  //const [minPrecio, setMinPrecio] = useState(0);
  //const [maxPrecio, setMaxPrecio] = useState(null);
  const [categoria, setCategoria] = useState('all');
  const [sortOrder, setSortOrder] = useState('masVendido');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState('');
  const [limite, setLimite] = useState(6);
  

const [precioMaximoProductos, setPrecioMaximoProductos] = useState('');

  const fetchProductos = async () => {
      try {
        setLoading(true);
        const filters = {
          vendedor: tienda.username,
          pagina: currentPage,
          limite: limite,
          active : "true"
        };

        if (sortOrder && sortOrder !== 'masVendido') {
          filters.orden = sortOrder;
        } else if (sortOrder === 'masVendido') {
          filters.orden = 'masVendido';
        }

        if (categoria !== 'all') {
          filters.categoria = categoria;
        }

        if (searchTerm.trim()) {
          filters.titulo = searchTerm.trim();
        }

        if (minPrecio.trim() && !isNaN(minPrecio)) {
          filters.minPrecio = parseFloat(minPrecio);
        }

        //if (maxPrecio.trim() && !isNaN(maxPrecio)) {
        //  filters.maxPrecio = parseFloat(maxPrecio);
        //}

        // Solo aplicar maxPrecio si el usuario lo modificó manualmente
        if (maxPrecio.trim() && !isNaN(maxPrecio)) {
          const productosArray = productos?._embedded?.productos || [];
          const precioMaximoActual = productosArray.length > 0 
            ? Math.max(...productosArray.map(p => p.precio))
            : 10000;
          
          // Solo filtrar si el usuario puso un valor menor al máximo
          if (parseFloat(maxPrecio) < precioMaximoActual) {
            filters.maxPrecio = parseFloat(maxPrecio);
          }
        }

        const data = await getProductosByVendedor(filters);
        setProductos(data);
        setTotalElements(data.pagina.totalElementos);
    
        
      // Calcular el precio máximo de los productos
      const productosArray = data?._embedded?.productos || [];
      if (productosArray.length > 0) {
        const maxPrecio = Math.max(...productosArray.map(p => p.precio));
        setPrecioMaximoProductos(maxPrecio);
      }
        

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
 
  const handleClearFilters = () => {
    setSearchTerm('');
    setMinPrecio('');
    setMaxPrecio('');
    setCategoria('all');
    setSortOrder('masVendido');
    setCurrentPage(1);
    setShouldFetch(true);
  };

    const onChange = page => {  
    setShouldFetch(true);
    setCurrentPage(page);
  };

  return (
    <div className="store-page" role="main" aria-labelledby="store-title">
      <div className='store-page__box'>
      <div className='store-page__header_box'>
        
          <div className="store-page__header">
            <h1 id="store-title" className="store-page__title">{tienda.nombre}</h1>
          </div>
        <div className="store-page__search-bar" >
          <Search 
            placeholder="Buscar productos..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSearch={fetchProductos}
            enterButton 
            size="large"
            className="search-bar"
            style={{ 
              width: '100%',
              maxWidth: '600px'
            }}
            aria-label="Buscar productos en la tienda"
          />
      
        </div>
      </div>
      </div>
      <div className = "filters_and_products_box">
              <div className="filter_box_store filter-desktop" role="complementary" aria-label="Panel de filtros">
                 <FiltrosStore 
                    minPrecio={minPrecio}
                    setMinPrecio={setMinPrecio}
                    maxPrecio={maxPrecio}
                    setMaxPrecio={setMaxPrecio}
                    precioMaximo={precioMaximoProductos}
                    categoria={categoria}
                    setCategoria={setCategoria}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                    handleClearFilters={handleClearFilters}
                    fetchProductos={fetchProductos}
                  />
            
              </div>
              <details className="filter-accordion filter-mobile" aria-label="Menú de filtros">
                <summary className="filter-accordion-header" aria-label="Expandir o contraer filtros">
                 Filtros
                </summary>
                <div className="filter-accordion-content">
                   <FiltrosStore 
                    minPrecio={minPrecio}
                    setMinPrecio={setMinPrecio}
                    maxPrecio={maxPrecio}
                    setMaxPrecio={setMaxPrecio}
                    precioMaximo={precioMaximoProductos}
                    categoria={categoria}
                    setCategoria={setCategoria}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                    handleClearFilters={handleClearFilters}
                    fetchProductos={fetchProductos}
                  />
                
                </div>
              </details>
                        
           <section aria-label="Productos de la tienda">   
           {loading ? (
            <Spinner role="status" aria-live="polite" aria-label="Cargando productos"/>
          ) : (
            <>
          {currentProducts.length > 0 ? (
            <div>
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
             <div className='paginacion'  aria-label="Paginación de productos">
                    <Pagination 
                            current={currentPage} 
                            onChange={onChange} 
                            total={totalElements} // Total de elementos, no páginas
                            pageSize={limite}
                            showSizeChanger={false}
                            style={{ marginTop: '20px', textAlign: 'center' }}
                            aria-label={`Página ${currentPage} de ${Math.ceil(totalElements / limite)}`}
                          /> 
                      </div> </div>
              
          ) : (
            <div className="store-page__no-results" aria-live="polite">
              <p>No se encontraron productos con los filtros seleccionados.</p>
            </div>
          )}
        </>
        )}
        </section>
      </div>
    </div>
  );
};

export default StorePage;