import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard.jsx';
import Spinner from '../../components/Spinner/Spinner.jsx';
import './StorePage.css';
import {getTiendaByVendedor} from '../../services/tiendaService.js'
import { getProductosByVendedor } from '../../services/productoService.js';
import { FiltrosStore } from '../../components/FiltrosStore/FiltrosStore.jsx';
import { Input, Pagination } from 'antd';
const { Search } = Input;

const StorePage = () => {
  const { vendedorUsername } = useParams();
  const navigate = useNavigate();
  
  const [productos, setProductos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [tienda, setTienda] = useState(null); // Guardar info de la tienda

  const [searchTerm, setSearchTerm] = useState('');
  const [minPrecio, setMinPrecio] = useState('');
  const [maxPrecio, setMaxPrecio] = useState('');
  const [categoria, setCategoria] = useState('all');
  const [sortOrder, setSortOrder] = useState('masVendido');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState('');
  const [limite, setLimite] = useState(6);
  const [precioMaximoProductos, setPrecioMaximoProductos] = useState(null);
  const [precioMaximoInicial, setPrecioMaximoInicial] = useState(null);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const filters = {
        vendedor: vendedorUsername,
        pagina: currentPage,
        limite: limite,
        active: "true"
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
      if (minPrecio !== '' && minPrecio !== null && !isNaN(minPrecio) && parseFloat(minPrecio) > 0) {
        filters.minPrecio = parseFloat(minPrecio);
      }
       if (maxPrecio !== '' && maxPrecio !== null && !isNaN(maxPrecio)) {
        const maxPrecioNum = parseFloat(maxPrecio);
        if (maxPrecioNum < precioMaximoProductos) {
          filters.maxPrecio = maxPrecioNum;
        }
      }
      
      const data = await getProductosByVendedor(filters);
      setProductos(data);
      setTotalElements(data.pagina.totalElementos);
  
      const productosArray = data?._embedded?.productos || [];
      if (productosArray.length > 0 && precioMaximoInicial === null) {
        const maxPrecio = Math.max(...productosArray.map(p => p.precio));
        setPrecioMaximoInicial(maxPrecio);
        setPrecioMaximoProductos(maxPrecio);
      }

    } catch (error) {
      console.error("Error fetching products:", error);
      setProductos({ _embedded: { productos: [] }, pagina: {} });
      navigate('/error', { state: { error: { status: '404', message: 'Tienda no encontrada' } } });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shouldFetch && vendedorUsername) {
      fetchProductos();
      setShouldFetch(false);
    }
  }, [shouldFetch, searchTerm, minPrecio, maxPrecio, categoria, sortOrder, currentPage, vendedorUsername]);

  const fetchTienda = async () =>{
      const tienda = await getTiendaByVendedor(vendedorUsername);
      setTienda(tienda)
  }
  useEffect(() =>{
    fetchTienda()
  },[])
  const currentProducts = productos?._embedded?.productos || [];
 
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

  if (!tienda && loading) {
    return <Spinner role="status" aria-live="polite" aria-label="Cargando tienda"/>;
  }

  return (
    <div className="store-page" role="main" aria-labelledby="store-title">
      <div className='store-page__box'>
        <div className='store-page__header_box'>
          <div className="store-page__header">
            <h1 id="store-title" className="store-page__title">
              {tienda.nombre}
            </h1>
          </div>
          <div className="store-page__search-bar">
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

      <div className="filters_and_products_box">
        <div className="filter_box_store filter-desktop" role="complementary" aria-label="Panel de filtros">
          <FiltrosStore 
            minPrecio={minPrecio}
            setMinPrecio={setMinPrecio}
            maxPrecio={maxPrecio}
            setMaxPrecio={setMaxPrecio}
            precioMaximo={precioMaximoInicial}
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
                  <div className='paginacion' aria-label="Paginación de productos">
                    <Pagination 
                      current={currentPage} 
                      onChange={onChange} 
                      total={totalElements}
                      pageSize={limite}
                      showSizeChanger={false}
                      style={{ marginTop: '20px', textAlign: 'center' }}
                      aria-label={`Página ${currentPage} de ${Math.ceil(totalElements / limite)}`}
                    /> 
                  </div>
                </div>
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