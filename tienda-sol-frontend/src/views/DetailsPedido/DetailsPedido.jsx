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
  return <Spinner>Cargando ... </Spinner>
}

const pedido = pedidos.find(p => p.id === id);
if (!pedido) return <p>No se encontró el pedido</p>;
  return (
    <div className="pedidoDetails-page">
      <h1 className="pedidoDetails-page__title">Pedido</h1>


          <div className="table-container">
            <table className="pedidos-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
             
              
             
            </table> 
              {pedido.items.map((item) => (
                     <ProductoItem key={item.productoId} item={item} />
                 ))}
          </div>
        
      <div className="pedidoDetails-page__summary">
        <div className="pedidoDetails-page__total">
              Total: <span>${pedido.total} {pedido.moneda}</span>
        </div>


        
      </div>
    </div>
  );
};

export default DetailsPedido;
