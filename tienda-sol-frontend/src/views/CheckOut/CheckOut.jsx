import React, { useState } from 'react';
import { useCart, useAuth } from '../../contexts/AppContext.jsx';
import { DireccionEntregaForm } from '../../components/DireccionEntregaFrom/DireccionEntregaFrom.jsx';
import { Button, Card } from 'antd';
import { Space, Table, Tag } from 'antd';
import { Descriptions } from 'antd';
import { crearPedido } from '../../services/pedidoService.js';
export const CheckOut = (({navigateTo})=> {
     const { cartItems, getCartTotal, clearCart } = useCart();
     console.log('Contenido de cartItems:', cartItems);
    const [orderPlaced, setOrderPlaced] = useState(false);

     const [isProcessing, setIsProcessing] = useState(false)
     const { currentUser } = useAuth();
     const cartItemsWithKeys = cartItems.map(item => ({
        ...item,
        key: item.producto._id, // Usa el ID único del item
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
    dataIndex: 'producto', // El objeto 'producto' es pasado a 'render'
    key: 'producto-titulo', // Key único para la columna
    render: (producto) => <strong>{producto.titulo}</strong>, // Accede a .titulo
  },
  {
    title: 'Cantidad',
    dataIndex: 'cantidad', // Accede directamente a item.cantidad
    key: 'cantidad',
  },
  {
    title: 'Subtotal',
    dataIndex: 'subtotal', // Puedes poner cualquier cosa aquí si usas 'render'
    key: 'subtotal',
    // 'text' es el valor de dataIndex (que no usamos aquí)
    // 'record' es el objeto completo de la fila (item del carrito)
    render: (text, record) => {
      // Calculamos el subtotal: precio * cantidad
      const subtotal = record.producto.precio * record.cantidad;
      
      return (
        <strong>{`$${subtotal.toFixed(2)}`}</strong>
      );
    }}
];

 const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const vendedorId = cartItems[0].producto.vendedor;
      const items = cartItems.map(item => ({
        productoId: item.producto._id,
        cantidad: item.cantidad,
        precioUnitario: item.producto.precio
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
        <Button onClick={() => navigateTo('home')} variant="primary" className="button--margin-top">
          Volver a la tienda
        </Button>
      </div>
    );
  }

    return <div className = "chechOut__style">
                
                <div className = "checkOut__direccion">
                    <h1 >Ingrese los datos de entrega</h1>
                    <div className='form-wrapper'>
                    <DireccionEntregaForm 
                        setData = {setData}/>
                    </div>
                </div>
                
             <div className="checkOut__resumen">
                <h1>Resumen</h1>
                <div className='table-wrapper'>                 
                <Card variant="borderless" style={{ width: '100%', maxWidth: '400px' }}>
                    <div style={{ width: '400px' }}> {/* O el ancho que desees */}
                        <Table
                            columns={columns}
                            dataSource={cartItemsWithKeys}
                            pagination={false}
                        />
                    </div>
                    <div className='checkOut__total'>
                        <p className='checkOut__total_value'>Total: <span>${   getCartTotal().toFixed(2)}</span></p>
                        <Button variant="secondary"
                                onClick={handleCheckout}>
                        Comprar</Button>
                    </div>
                </Card>
                </div>
             </div>

         
    </div>
})