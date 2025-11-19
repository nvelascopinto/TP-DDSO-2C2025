import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../contexts/AppContext.jsx';
import Spinner from '../../components/Spinner/Spinner.jsx';
import Modal from '../../components/Modal/Modal.jsx';
import ProductForm from '../../components/ProductsForm/ProductForm.jsx';
import Button from '../../components/Button/Button.jsx';
import './SellerDashboard.css';
import { getProductosByVendedor, actualizarProducto, crearProducto } from '../../services/productoService.js';
import { Pagination } from 'antd';
import { Switch } from 'antd';

const SellerDashboard = () => {
  const { currentUser } = useAuth();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState('');
  const [limite, setLimite] = useState(5);

  const fetchProductos = useCallback(async () => {
    if (currentUser) {
      try {
        setLoading(true);
         const filters = {
          vendedor: currentUser.username,
          limite : limite,
          pagina :currentPage
        };
        const data = await getProductosByVendedor(filters);
        setProductos(data);
        setTotalElements(data.pagina.totalElementos);
        console.log("PAGINAS TOTALES : " + data.pagina.totalPaginas)
      } catch (error) {
        console.error("Error fetching seller products:", error);
      } finally {
        setLoading(false);
      }
    }
      
  }, [currentUser, currentPage, limite]);

  const currentProducts = productos?._embedded?.productos || [];
  
  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);
  
  const onChange = page => {
    setCurrentPage(page);
  };
  const handleOpenAddModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleFormSubmit = async (productData, isNew) => {
    if (!currentUser) return;
    try {
      if (isNew) {
        console.log("PRODUCTO NUEVOOOO" + productData.stock)
        await crearProducto(currentUser.username, productData);
      } else {
        await actualizarProducto(selectedProduct._id, productData,currentUser.username);
      }
      handleCloseModal();
      fetchProductos();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("No se pudo guardar el producto.");
    }
  };

const handleToggleActive = async (product,value) => {
  if (!currentUser) return;
  const active = Boolean(value);
  try {
    const productData = {
            titulo : product.titulo,
            descripcion : product.descripcion,
            precio: product.precio,
            stock: product.stock,
            moneda : product.moneda,
            categoria: product.categoria,
            activo: active,
            fotos : product.fotos}
    await actualizarProducto(product._id, productData, currentUser.username);
    fetchProductos();
  } catch (error) {
    console.error("Error actualizando estado:", error);
    alert("No se pudo actualizar el estado del producto.");
  }
};

  if (!currentUser) return null;

  return (
    <div className="dashboard" role="main" aria-labelledby="dashboard-title">
      <h1 className="dashboard__title" id="dashboard-title">Productos de Vendedor</h1>
      <p className="dashboard__welcome">Bienvenido, {currentUser.username}</p>

      <div className="dashboard__content-box">
        <div className="dashboard__header">
          <h2 className="dashboard__subtitle" id="dashboard-products-title">Mis Productos</h2>
          <Button variant="primary" onClick={handleOpenAddModal} aria-label="Agregar nuevo producto">
            + Agregar Producto
          </Button>
        </div>

        {loading ? <Spinner role="status" aria-live="polite" aria-label="Cargando productos del vendedor"/> : (
          <div className="table-container" role="region" aria-label="Lista de productos del vendedor">
            <table className="products-table" aria-labelledby="dashboard-products-title">
              <thead>
                <tr>
                  <th scope="col">Producto</th>
                  <th scope="col">Precio</th>
                  <th scope="col">Stock</th>
                  <th scope="col">Activo</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map(p => (
                  <tr key={p._id}>
                    <td data-label="Producto">{p.titulo}</td>
                    <td data-label="Precio">${p.precio.toFixed(2)}</td>
                    <td data-label="Stock">{p.stock}</td>
                    <td data-label="Activo">
                      <Switch 
                        checked={p.activo} 
                        onChange={(value) => handleToggleActive(p, value)}
                        aria-label={`${p.activo ? 'Desactivar' : 'Activar'} producto ${p.titulo}`}
                  
                      />
                    </td>
                    <td data-label="Acciones">
                      <button onClick={() => handleOpenEditModal(p)} className="table-action-button" aria-label={`Editar producto ${p.titulo}`}>Editar
                      <span class="material-symbols-outlined">edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {isModalOpen && (
        <Modal onClose={handleCloseModal} title={selectedProduct ? "Editar Producto" : "Agregar Nuevo Producto"}>
          <ProductForm
            onSubmit={handleFormSubmit}
            onCancel={handleCloseModal}
            initialData={selectedProduct}
          />
        </Modal>
      )}
      <div className='paginacion'>
      <Pagination 
              current={currentPage} 
              onChange={onChange} 
              total={totalElements} 
              pageSize={limite}
              showSizeChanger={false}
              style={{ marginTop: '20px', textAlign: 'center' }}
            /> 
        </div>
    </div>
  );
};

export default SellerDashboard;
