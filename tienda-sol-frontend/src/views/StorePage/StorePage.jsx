
import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../../services/mockService.js';
import ProductCard from '../../components/ProductCard/ProductCard.jsx';
import Spinner from '../../components/Spinner/Spinner.jsx';
import './StorePage.css';

const StorePage = ({ vendedor }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('popular');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const data = await api.getProductosByVendedor(vendedor.id);
        setProductos(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, [vendedor.id]);

  const categories = useMemo(() => {
    const allCategories = new Map();
    productos.forEach(p => {
      p.categorias.forEach(c => {
        if (!allCategories.has(c.id)) {
          allCategories.set(c.id, c);
        }
      });
    });
    return Array.from(allCategories.values());
  }, [productos]);

  const filteredAndSortedProducts = useMemo(() => {
    const lowercasedSearch = searchTerm.toLowerCase();
    let result = productos
      .filter(p =>
        p.titulo.toLowerCase().includes(lowercasedSearch) ||
        p.descripcion.toLowerCase().includes(lowercasedSearch) ||
        p.categorias.some(c => c.nombre.toLowerCase().includes(lowercasedSearch))
      )
      .filter(p =>
        selectedCategory === 'all' || p.categorias.some(c => c.id === selectedCategory)
      );

    switch (sortOrder) {
      case 'asc':
        result.sort((a, b) => a.precio - b.precio);
        break;
      case 'desc':
        result.sort((a, b) => b.precio - a.precio);
        break;
      case 'popular':
        // Mock popularity by shuffling based on ID
        result.sort((a, b) => a.id.localeCompare(b.id));
        break;
    }
    return result;
  }, [productos, searchTerm, sortOrder, selectedCategory]);


  return (
    <div className="store-page">
      <div className="store-page__header">
        <h1 className="store-page__title">{vendedor.nombre}</h1>
        <p className="store-page__subtitle">Nuestro catálogo de productos</p>
      </div>

      <div className="store-page__filters-bar">
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
          >
            <option value="popular">Más vendidos</option>
            <option value="asc">Precio: Menor a Mayor</option>
            <option value="desc">Precio: Mayor a Menor</option>
          </select>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="store-page__product-grid">
          {filteredAndSortedProducts.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StorePage;
