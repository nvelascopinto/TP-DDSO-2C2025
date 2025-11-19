
import React, { useEffect, useState } from 'react';
import { useAuth, usePedidos } from '../../contexts/AppContext.jsx';
import { EstadoPedido } from '../../../enums.js';
import Spinner from '../../components/Spinner/Spinner.jsx';
import './OrderHistoryPage.css';
import PedidoAcciones from '../../components/StateButton/StateButton.jsx';
import Button from '../../components/Button/Button.jsx';

const getStatusClass = (status) => {
    switch (status) {
        case EstadoPedido.PENDIENTE:
            return 'status-badge--pending'
        case EstadoPedido.CONFIRMADO:
            return 'status-badge--confirm';
        case EstadoPedido.EN_PREPARACION:
            return 'status-badge--preparing';
        case EstadoPedido.ENVIADO:
            return 'status-badge--shipped';
        case EstadoPedido.ENTREGADO:
            return 'status-badge--delivered';
        case EstadoPedido.CANCELADO:
            return 'status-badge--cancelled';
        default:
            return 'status-badge--default';
    }
}

const OrderHistoryPage = ({ navigateTo }) => {
    const { currentUser } = useAuth();
    const { pedidos, getPedidosUser, updatePedido} = usePedidos();
     const [refreshKey, setRefreshKey] = useState(0);


    useEffect(() => {
        getPedidosUser();
    }, [getPedidosUser, refreshKey]);

    useEffect(() => {
        console.log('Pedidos actualizados:', pedidos);
    }, [pedidos]);

    const handleEstadoActualizado = () => {
        getPedidosUser();
    };

    


    return (
        <div className="order-history-page" role="main" aria-labelledby="order-history-title">
            <h1 className="order-history-page__title" id="order-history-title">Mi Historial de Pedidos</h1>
            {pedidos.length === 0 ? (
                <p className="order-history-page__empty-message" role="status" aria-live="polite">Aún no has realizado ningún pedido.</p>
            ) : (
                <div className="order-list" role="list">
                    {pedidos.map((pedido) => {
                        return (
                            <div key={pedido._id} className ="order-form" role="listitem" aria-labelledby={`order-id-${pedido._id}`}>
                                <div className="order-item__header">
                                    <div>
                                        <p className="order-item__date">
                                            Realizado el: {new Date(pedido.fechaCreacion).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className = "order-state-id">
                                        <div className="order-item__actions" role="group" aria-label="Identificación del pedido">
                                                <h2 className="order-item__id">Pedido #{pedido.numero}</h2>
                                                <span className={`status-badge ${getStatusClass(pedido.estadoNombre)}`} role="status" aria-live="polite" aria-label={`Estado del pedido: ${pedido.estadoNombre}`}>
                                                    {pedido.estadoNombre}
                                                </span>
                                        </div>
                                    </div>
                                </div>
                                <div className = "order-change-state">
                                        <div role="region" aria-label={`Acciones del pedido ${pedido._id}`}>
                                            <PedidoAcciones pedido={pedido} 
                                            onEstadoActualizado={handleEstadoActualizado} 
                                            />
                                        </div>
                                </div>
                                <div className="order-item__body">
                                        <div aria-label={`Ver detalles del pedido número ${pedido.numero}`}>
                                        <Button onClick={() =>  navigateTo(`historial-pedidos/${pedido.numero}`, null, pedido._id)} aria-label={`Ver detalles del pedido ${pedido._id}`}>
                                            Ver Pedido
                                        </Button>
                                        </div>
                                        <div>
                                            <p className="order-item__total">Total: <span aria-label={`Total del pedido: ${pedido.total.toFixed(2)}`}>${pedido.total.toFixed(2)}</span></p>
                                        </div>
                                        
                                </div>
                                
                                
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default OrderHistoryPage;
