import React, { useEffect, useState, useMemo } from 'react';
import ProductoItem from '../../components/ProductoItem/ProductoItem.jsx';
import './DetailsPedido.css';
import { useParams } from 'react-router-dom';
import { usePedidos } from '../../contexts/AppContext.jsx';
import Spinner from '../../components/Spinner/Spinner.jsx';
const DetailsPedido = ({}) => {
  const { id } = useParams(); 
  const { pedidos } = usePedidos();

if (!pedidos || pedidos.length === 0) {
  return <Spinner role="status" aria-live="polite" aria-label="Cargando pedidos">
    Cargando ... 
    </Spinner>
}

const pedido = pedidos.find(p => p.id === id);
if (!pedido) return <p role="alert">No se encontró el pedido</p>;
  return (
    <div className="pedidoDetails-page" role="main"       aria-labelledby="pedidoDetails-title" aria-describedby="pedidoDetails-summary">
      <h1 className="pedidoDetails-page__title">Pedido</h1>


          <div className="table-container" role="region" aria-label="Detalle de los productos del pedido">
            <table className="pedidos-table" role="table" aria-describedby="pedidoDetails-summary">
              <thead>
                <tr role="row">
                  <th scope="col">Producto</th>
                  <th scope="col">Cantidad</th>
                  <th scope="col">Subtotal</th>
                </tr>
              </thead>
             
              
             
            </table> 
              {pedido.items.map((item) => (
                     <ProductoItem key={item.productoId} item={item} />
                 ))}
          </div>
        
      <div className="pedidoDetails-page__summary" aria-label="Resumen del pedido">
        <div className="pedidoDetails-page__total" aria-live="polite">
              Total: <span>${pedido.total} {pedido.moneda}</span>
        </div>


        
      </div>
    </div>
  );
};

export default DetailsPedido;
