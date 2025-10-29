
import React, { useEffect, useState, useMemo } from 'react';
//import { api } from '../../services/mockService.js';
import ProductCard from '../../components/ProductCard/ProductCard.jsx';
import Spinner from '../../components/Spinner/Spinner.jsx';
import './StorePage.css';
import { getProductosByVendedor } from '../../services/productoService.js';

const StorePage = ({ vendedor }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('popular');
  const [selectedCategory, setSelectedCategory] = useState('all');

  //  paginación
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

        // Agregar orden solo si no es el valor por defecto
        if (sortOrder && sortOrder !== 'masVendido') {
          filters.orden = sortOrder;
        } else if (sortOrder === 'masVendido') {
          filters.orden = 'masVendido';
        }

        // Agregar categoría solo si no es 'all'
        if (selectedCategory !== 'all') {
          filters.categoria = selectedCategory;
        }

        // Agregar búsqueda - el backend busca en nombre, descripción y categoría
        if (searchTerm.trim()) {
          filters.nombre = searchTerm.trim();
        }
//          const filters = {
//         vendedor: vendedor.username,
//  //       search: searchTerm || undefined,
//         category: selectedCategory !== 'all' ? selectedCategory : undefined,
//         sort: sortOrder !== 'popular' ? sortOrder : undefined,
//         page: currentPage,
//         limit: productsPerPage
//       };
         const data = await getProductosByVendedor(filters);
         setProductos(data);
       } catch (error) {
         console.error("Error fetching products:", error);
       } finally {
         setLoading(false);
       }
    };
    fetchProductos();
  }, [vendedor.id,searchTerm, selectedCategory, sortOrder, currentPage]);

  const categories = useMemo(() => {
    const allCategories = new Map();
    // productos.items?.forEach(p => { //  Si el backend devuelve { items: [...] }
    productos.forEach(p => {
      p.categorias.forEach(c => {
        if (!allCategories.has(c.id)) {
          allCategories.set(c.id, c);
        }
      });
    });
    return Array.from(allCategories.values());
  }, [productos]);

  // const filteredAndSortedProducts = useMemo(() => {
  //   const lowercasedSearch = searchTerm.toLowerCase();
  //   let result = productos
  //     .filter(p =>
  //       p.titulo.toLowerCase().includes(lowercasedSearch) ||
  //       p.descripcion.toLowerCase().includes(lowercasedSearch) ||
  //       p.categorias.some(c => c.nombre.toLowerCase().includes(lowercasedSearch))
  //     )
  //     .filter(p =>
  //       selectedCategory === 'all' || p.categorias.some(c => c.id === selectedCategory)
  //     );

  //   switch (sortOrder) {
  //     case 'asc':
  //       result.sort((a, b) => a.precio - b.precio);
  //       break;
  //     case 'desc':
  //       result.sort((a, b) => b.precio - a.precio);
  //       break;
  //     case 'popular':
  //       result.sort((a, b) => a.id.localeCompare(b.id));
  //       break;
  //   }
  //   return result;
  // }, [productos, searchTerm, sortOrder, selectedCategory]);

  const totalPages = Math.ceil(productos.total / productsPerPage); // si el backend te devuelve total
const currentProducts = productos.items || productos;
 //  Calcular productos paginados
  // const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage);
  // const startIndex = (currentPage - 1) * productsPerPage;
  // const endIndex = startIndex + productsPerPage;
  // const currentProducts = filteredAndSortedProducts.slice(startIndex, endIndex);

  // Resetear página si cambian filtros/búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortOrder, selectedCategory]);

  return (
    <div className="store-page" role="main" aria-labelledby="store-title">
      <div className="store-page__header">
        <h1 id="store-title" className="store-page__title">{vendedor.nombre}</h1>
        <p className="store-page__subtitle">Nuestro catálogo de productos</p>
      </div>

      <div  className="store-page__filters-bar" role="search" aria-label="Barra de filtros y búsqueda de productos">
        <input
          type="text"
          placeholder="Buscar por nombre, descripción, categoría..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="filter-input"
        />
        <div className="filter-controls">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
            aria-label="Seleccionar categoría"
          >
            <option value="all">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="filter-select"
            aria-label="Ordenar por criterio"
          >
            <option value="popular">Más vendidos</option>
            <option value="asc">Precio: Menor a Mayor</option>
            <option value="desc">Precio: Mayor a Menor</option>
          </select>
        </div>
      </div>

      {loading ? (
        <Spinner role="status" aria-live="polite" aria-label="Cargando productos"/>
      ) : (
        <>
        <div className="store-page__product-grid" role="grid"
        aria-label="Lista de productos disponibles">
    
            {currentProducts.map((producto) => (
            <ProductCard key={producto.id} role="gridcell"
            aria-label={`Producto ${producto.titulo}, precio ${producto.precio} pesos`} producto={producto} />
          ))}
        </div>
      
       {/*  Controles de paginación */}
          {totalPages > 1 && (
            <div className="pagination" role="navigation" aria-label="Controles de paginación de productos">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                aria-label="Ir a la página anterior"
              >
                Anterior
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={currentPage === i + 1 ? 'active' : ''}
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
