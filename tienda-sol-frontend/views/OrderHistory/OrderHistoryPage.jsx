
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AppContext.jsx';
import { api } from '../../services/mockService.js';
import { EstadoPedido } from '../../enums.js';
import Spinner from '../../components/Spinner/Spinner.jsx';
import './OrderHistoryPage.css';

const getStatusClass = (status) => {
    switch (status) {
        case EstadoPedido.PENDIENTE:
        case EstadoPedido.CONFIRMADO:
            return 'status-badge--pending';
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

const OrderHistoryPage = () => {
    const { currentUser } = useAuth();
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPedidos = async () => {
            if (currentUser) {
                try {
                    setLoading(true);
                    const data = await api.getPedidosByComprador(currentUser.id);
                    setPedidos(data);
                } catch (error) {
                    console.error("Error fetching order history:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchPedidos();
    }, [currentUser]);

    const handleCancelarPedido = async (pedidoId) => {
        if (window.confirm("¿Estás seguro de que deseas cancelar este pedido?")) {
            try {
                const pedidoActualizado = await api.cancelarPedido(pedidoId);
                setPedidos(prevPedidos =>
                    prevPedidos.map(p =>
                        p.id === pedidoId ? pedidoActualizado : p
                    )
                );
                alert("Pedido cancelado exitosamente.");
            } catch (error) {
                console.error("Error al cancelar el pedido:", error);
                alert("No se pudo cancelar el pedido. Por favor, intenta de nuevo.");
            }
        }
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="order-history-page">
            <h1 className="order-history-page__title">Mi Historial de Pedidos</h1>
            {pedidos.length === 0 ? (
                <p className="order-history-page__empty-message">Aún no has realizado ningún pedido.</p>
            ) : (
                <div className="order-list">
                    {pedidos.map((pedido) => {
                        const isCancelable = [
                            EstadoPedido.PENDIENTE,
                            EstadoPedido.CONFIRMADO,
                            EstadoPedido.EN_PREPARACION
                        ].includes(pedido.estado);

                        return (
                            <div key={pedido.id} className="order-item">
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
                                        {isCancelable && (
                                            <button
                                                onClick={() => handleCancelarPedido(pedido.id)}
                                                className="order-item__cancel-button"
                                            >
                                                Cancelar Pedido
                                            </button>
                                        )}
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
