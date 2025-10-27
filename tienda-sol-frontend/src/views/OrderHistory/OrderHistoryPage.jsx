
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

    // const handleCancelarPedido = async (pedidoId) => {
    //     if (window.confirm("¿Estás seguro de que deseas cancelar este pedido?")) {
    //         try {
    //             const pedidoActualizado = await api.cancelarPedido(pedidoId);
    //            updatePedido(pedidoActualizado)
    //             alert("Pedido cancelado exitosamente.");
    //         } catch (error) {
    //             console.error("Error al cancelar el pedido:", error);
    //             alert("No se pudo cancelar el pedido. Por favor, intenta de nuevo.");
    //         }
    //     }
    // };

    

    return (
        <div className="order-history-page">
            <h1 className="order-history-page__title">Mi Historial de Pedidos</h1>
            {pedidos.length === 0 ? (
                <p className="order-history-page__empty-message">Aún no has realizado ningún pedido.</p>
            ) : (
                <div className="order-list">
                    {pedidos.map((pedido) => {
                        return (
                            <div key={pedido.id}  >
                                <div className="order-item__header">
                                    <h2 className="order-item__id">Pedido #{pedido.id}</h2>
                                    <p className="order-item__date">
                                    
                                        Realizado el: {new Date(pedido.fechaCreacion).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="order-item__body">
                                    <div>
                                        <p className="order-item__total">Total: <span>${pedido.total.toFixed(2)}</span></p>
                                    </div>
                                    <div className="order-item__actions">
                                        <span className={`status-badge ${getStatusClass(pedido.estado)}`}>
                                            {pedido.estado}
                                        </span>
                                         <PedidoAcciones
                                            pedido={pedido}
                                           
                                            />
                                        
                                    </div>
                                </div>
                                <Button onClick={() =>  navigateTo(`historial-pedidos/${pedido.id}`)}>
                                    Ver Pedido
                                </Button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default OrderHistoryPage;
