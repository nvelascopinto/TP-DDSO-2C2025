
import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../contexts/AppContext.jsx';
import { api } from '../../services/mockService.js';
import Spinner from '../../components/Spinner/Spinner.jsx';
import Modal from '../../components/Modal/Modal.jsx';
import ProductForm from '../../components/ProductsForm/ProductForm.jsx';
import Button from '../../components/Button/Button.jsx';
import './SellerDashboard.css';

const SellerDashboard = () => {
  const { currentUser } = useAuth();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProductos = useCallback(async () => {
    if (currentUser) {
      try {
        setLoading(true);
        const data = await api.getProductosByVendedor(currentUser.id);
        setProductos(data);
      } catch (error) {
        console.error("Error fetching seller products:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

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
        await api.crearProducto(currentUser.id, productData);
      } else {
        await api.actualizarProducto(productData.id, productData);
      }
      handleCloseModal();
      fetchProductos();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("No se pudo guardar el producto.");
    }
  };

  if (!currentUser) return null;

  return (
    <div className="dashboard">
      <h1 className="dashboard__title">Productos de Vendedor</h1>
      <p className="dashboard__welcome">Bienvenido, {currentUser.nombre}.</p>

      <div className="dashboard__content-box">
        <div className="dashboard__header">
          <h2 className="dashboard__subtitle">Mis Productos</h2>
          <Button variant="primary" onClick={handleOpenAddModal}>
            + Agregar Producto
          </Button>
        </div>

        {loading ? <Spinner /> : (
          <div className="table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Activo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map(p => (
                  <tr key={p.id}>
                    <td data-label="Producto">{p.titulo}</td>
                    <td data-label="Precio">${p.precio.toFixed(2)}</td>
                    <td data-label="Stock">{p.stock}</td>
                    <td data-label="Activo">{p.activo ? 'Sí' : 'No'}</td>
                    <td data-label="Acciones">
                      <button onClick={() => handleOpenEditModal(p)} className="table-action-button">Editar</button>
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
    </div>
  );
};

export default SellerDashboard;
