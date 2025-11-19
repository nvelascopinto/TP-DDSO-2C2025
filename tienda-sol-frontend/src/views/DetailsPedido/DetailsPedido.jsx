import React, { useEffect, useState, useMemo } from 'react';
import ProductoItem from '../../components/ProductoItem/ProductoItem.jsx';
import './DetailsPedido.css';
import { useParams } from 'react-router-dom';
import { usePedidos } from '../../contexts/AppContext.jsx';
import { EstadoPedido } from '../../../enums.js';
import PedidoAcciones from '../../components/StateButton/StateButton.jsx';
import Spinner from '../../components/Spinner/Spinner.jsx';
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

const DetailsPedido = ({navigateTo}) => {
  const { numero } = useParams(); 
  const { pedidos, getPedidosUser, updatePedido} = usePedidos();
   const [loading, setLoading] = useState(true);

    const handleEstadoActualizado = () => {
      getPedidosUser();
    };

  useEffect(() => {
    const loadPedidos = async () => {

      if (!pedidos || pedidos.length === 0) {
        await getPedidosUser();
      }
      setLoading(false);
    };
    
    loadPedidos();
  }, [pedidos, getPedidosUser]);

  if (loading || !pedidos || pedidos.length === 0) {
    return (
      <Spinner role="status" aria-live="polite" aria-label="Cargando pedidos">
        Cargando ... 
      </Spinner>
    );
  }


const pedido = pedidos.find(p => p.numero == numero);
if (!pedido) return <p role="alert">No se encontró el pedido</p>;
  return (
    <div>
    <div className="pedidoDetails-page" role="main" aria-labelledby="pedidoDetails-title" aria-describedby="pedidoDetails-summary">
      <h1 className="pedidoDetails-page__title">Pedido #{pedido.numero}</h1>
                                          <div className="order-item__header">
                                    <div>
                                        <p className="order-item__date">
                                            Realizado el: {new Date(pedido.fechaCreacion).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className = "order-state-id">
                                        <div className="order-item__actions" role="group" aria-label="Identificación del pedido">
                                                <h2 className="order-item__id"></h2>
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
                             
                              
          <div className="table-container" role="region" aria-label="Detalle de los productos del pedido">
           
              {pedido.items.map((item) => (
                     <ProductoItem key={item.producto._id} item={item} />
                 ))}
          </div>
        
      <div className="pedidoDetails-page__summary" aria-label="Resumen del pedido">
        <div className="pedidoDetails-page__total" aria-live="polite">
              Total: <span>${pedido.total} {pedido.moneda}</span>
        </div>


        
      </div>
    </div >
      <div className = "button-pedidoDetails "  aria-label="Volver al historial de pedidos">
        <Button  className = "volver-button" onClick={() => navigateTo('historial-pedidos')} aria-label={`Ver detalles del pedido ${pedido._id}`}>Volver</Button>
      </div>
    </div>
  );
};

export default DetailsPedido;