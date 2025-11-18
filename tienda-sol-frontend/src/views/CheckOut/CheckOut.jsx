import React, { useState } from 'react';
import { useCart, useAuth } from '../../contexts/AppContext.jsx';
import { DireccionEntregaForm } from '../../components/DireccionEntregaFrom/DireccionEntregaFrom.jsx';
import { Button, Card, Table } from 'antd';
import { crearPedido } from '../../services/pedidoService.js';
import { verificarStockProductos } from '../../services/productoService.js';
import './CheckOut.css';
import Modal from "../../components/Modal/Modal.jsx";

export const CheckOut = ({ navigateTo }) => {
    const { cartItems, getCartTotal, clearCart, removeFromCart } = useCart();
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const { currentUser } = useAuth();

    const [showStockModal, setShowStockModal] = useState(false);
    const [productosSinStock, setProductosSinStock] = useState([]);

    const cartItemsWithKeys = cartItems.map(item => ({
        ...item,
        key: item.producto._id,
    }));

    const dataDireccion = {
        calle: null,
        altura: null,
        piso: null,
        departamento: null,
        codigoPostal: null,
        ciudad: null,
        provincia: null,
        pais: null
    };

    const [data, setData] = useState(dataDireccion);

    const columns = [
        {
            title: 'Producto',
            dataIndex: 'producto',
            key: 'producto-titulo',
            render: (producto) => <strong>{producto.titulo}</strong>,
        },
        {
            title: 'Cantidad',
            dataIndex: 'cantidad',
            key: 'cantidad',
        },
        {
            title: 'Subtotal',
            dataIndex: 'subtotal',
            key: 'subtotal',
            render: (text, record) => {
                const subtotal = record.producto.precio * record.cantidad;
                return <strong>{`$${subtotal.toFixed(2)}`}</strong>;
            },
        }
    ];

    const handleCheckout = async () => {
        setIsProcessing(true);
        try {
            const productosAVerificar = cartItems.map(item => ({
                productoId: item.producto._id,
                cantidadSolicitada: item.cantidad
            }));

            const resultadoStock = await verificarStockProductos(productosAVerificar);

            if (!resultadoStock.stockSuficiente) {
                setProductosSinStock(resultadoStock.productosSinStock);
                setShowStockModal(true);
                setIsProcessing(false);
                return;
            }

            const vendedorId = cartItems[0].producto.vendedor;
            const items = cartItems.map(item => ({
                producto: item.producto._id,
                cantidad: item.cantidad
            }));

            await crearPedido(currentUser.username, vendedorId, items, data);
            setOrderPlaced(true);
            clearCart();

        } catch (error) {
            console.error("Error creando la orden: ", error);
            alert("Hubo un error al verificar el stock o procesar tu pedido. Por favor, intenta de nuevo.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCloseStockModal = () => {
        setShowStockModal(false);
        navigateTo('carrito');
    };

    if (orderPlaced) {
        return (
            <div className="order-success-message" role="status" aria-live="polite">
                <h1 className="order-success-message__title">¡Gracias por tu compra!</h1>
                <p>Tu pedido ha sido realizado con éxito.</p>
                <p>Recibirás notificaciones sobre su estado.</p>
                <div aria-label="Volver a la página principal">
                <Button onClick={() => navigateTo('home')} type="primary" size="large">
                    Volver a la tienda
                </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkOut__style">
            <div className="checkOut__direccion">
                <h1>Ingrese los datos de entrega</h1>
                <div className="form-wrapper">
                    <DireccionEntregaForm
                        setData={setData}
                        onFormValidChange={setIsFormValid}
                        aria-label="Formulario de dirección de entrega"
                    />
                </div>
            </div>

            <div className="checkOut__resumen">
                <h1>Resumen</h1>
                <div className="table-wrapper">
                    <Card style={{ width: '100%' }}>
                        <Table
                            columns={columns}
                            dataSource={cartItemsWithKeys}
                            pagination={false}
                            aria-label="Resumen de productos en el pedido"
                        />
                        <div className="checkOut__total" role="group" aria-label="Total y finalizar compra">
                            <p className="checkOut__total_value"  aria-live="polite">
                                Total: <span>${getCartTotal().toFixed(2)}</span>
                            </p>
                            <div aria-label={isProcessing ? 'Procesando compra' : 'Finalizar compra'} aria-busy={isProcessing}>
                            <Button
                                type="primary"
                                onClick={handleCheckout}
                                disabled={!isFormValid || isProcessing}
                                size="large"
                            >
                                {isProcessing ? 'Procesando...' : 'Comprar'}
                            </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {showStockModal && (
                <Modal
                    onClose={handleCloseStockModal}
                    title="Stock insuficiente"
                    role="alertdialog"
                    aria-labelledby="stock-modal-title"
                    aria-describedby="stock-modal-desc"
                >
                    <div className="stock-modal-content" role="list">
                        <p>Los siguientes productos no tienen stock suficiente:</p>
                        <ul className="stock-modal-list"  role="listitem">
                            {productosSinStock.map(p => (
                                <li key={p.productoId}>
                                    <strong>{p.titulo}</strong>:
                                    Solicitaste <strong>{p.cantidadSolicitada}</strong> unidades,
                                    pero solo hay <strong>{p.stockDisponible}</strong> disponibles.
                                </li>
                            ))}
                        </ul>
                        <p>Por favor, ajusta las cantidades en tu carrito o elimina los productos sin stock.</p>
                        <Button
                            type="primary"
                            onClick={handleCloseStockModal}
                            style={{ marginTop: '20px' }}
                            aria-label="Cerrar y volver al carrito"
                        >
                            Volver al carrito
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default CheckOut;
