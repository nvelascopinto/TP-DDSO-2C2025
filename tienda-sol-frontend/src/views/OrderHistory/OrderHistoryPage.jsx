
import React, { useEffect, useState } from 'react';
import { useAuth, usePedidos } from '../../contexts/AppContext.jsx';
import { api } from '../../services/mockService.js';
import { EstadoPedido } from '../../../enums.js';
import Spinner from '../../components/Spinner/Spinner.jsx';
import './OrderHistoryPage.css';
import PedidoAcciones from '@/src/components/StateButton/StateButton.jsx';
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

    useEffect(() => {
        getPedidosUser();
        console.log(pedidos)
    }, [getPedidosUser]);
    

    return (
        <div className="order-history-page">
            <h1 className="order-history-page__title">Mi Historial de Pedidos</h1>
            {pedidos.length === 0 ? (
                <p className="order-history-page__empty-message">Aún no has realizado ningún pedido.</p>
            ) : (
                <div className="order-list">
                    {pedidos.map((pedido) => {
                        return (
                            <div key={pedido.id} className ="order-form">
                                <div className="order-item__header">
                                    <div>
                                        <p className="order-item__date">
                                            Realizado el: {new Date(pedido.fechaCreacion).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className = "order-state-id">
                                        <div className="order-item__actions">
                                                <h2 className="order-item__id">Pedido #{pedido.id}</h2>
                                                <span className={`status-badge ${getStatusClass(pedido.estado)}`}>
                                                    {pedido.estado}
                                                </span>
                                        </div>
                                    </div>
                                </div>
                                <div className = "order-change-state">
                                    <PedidoAcciones pedido={pedido}/>
                                </div>
                                <div className="order-item__body">
                                        <Button onClick={() =>  navigateTo(`historial-pedidos/${pedido.id}`)}>
                                            Ver Pedido
                                        </Button>
                                        <div>
                                            <p className="order-item__total">Total: <span>${pedido.total.toFixed(2)}</span></p>
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
