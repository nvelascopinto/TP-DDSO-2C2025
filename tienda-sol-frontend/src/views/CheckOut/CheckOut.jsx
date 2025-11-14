import React, { useState } from 'react';
import { useCart, useAuth } from '../../contexts/AppContext.jsx';
import { DireccionEntregaForm } from '../../components/DireccionEntregaFrom/DireccionEntregaFrom.jsx';
import { Button, Card, Table } from 'antd';
import { crearPedido } from '../../services/pedidoService.js';
import './CheckOut.css';

export const CheckOut = (({navigateTo})=> {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const { currentUser } = useAuth();
    
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
    }
    const [data, setData] = useState(dataDireccion)
    
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
            }
        }
    ];

    const handleCheckout = async () => {
        setIsProcessing(true);
        try {
            const vendedorId = cartItems[0].producto.vendedor;
            const items = cartItems.map(item => ({
                producto: item.producto._id,
                cantidad: item.cantidad
            }));
            const total = getCartTotal();
            
            await crearPedido(currentUser.username, vendedorId, items, data);
            setOrderPlaced(true);
            clearCart();
        } catch (error) {
            console.error("Error creando la orden: ", error);
            alert("Hubo un error al procesar tu pedido. Intenta de nuevo.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (orderPlaced) {
        return (
            <div className="order-success-message" role="status" aria-live="polite">
                <h1 className="order-success-message__title">¡Gracias por tu compra!</h1>
                <p>Tu pedido ha sido realizado con éxito.</p>
                <p>Recibirás notificaciones sobre su estado.</p>
                <Button onClick={() => navigateTo('home')} type="primary" size="large">
                    Volver a la tienda
                </Button>
            </div>
        );
    }

    return (
        <div className="checkOut__style">
            <div className="checkOut__direccion">
                <h1>Ingrese los datos de entrega</h1>
                <div className='form-wrapper'>
                    <DireccionEntregaForm 
                        setData={setData}
                        onFormValidChange={setIsFormValid}
                    />
                </div>
            </div>
            
            <div className="checkOut__resumen">
                <h1>Resumen</h1>
                <div className='table-wrapper'>                 
                    <Card style={{ width: '100%' }}>
                        <Table
                            columns={columns}
                            dataSource={cartItemsWithKeys}
                            pagination={false}
                        />
                        <div className='checkOut__total'>
                            <p className='checkOut__total_value'>
                                Total: <span>${getCartTotal().toFixed(2)}</span>
                            </p>
                            <Button 
                                type="primary"
                                onClick={handleCheckout}
                                disabled={!isFormValid || isProcessing}
                                size="large"
                            >
                                {isProcessing ? 'Procesando...' : 'Comprar'}
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
})