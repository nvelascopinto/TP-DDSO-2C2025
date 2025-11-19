import React, { useState, useEffect } from "react";
import { useAuth, usePedidos } from "../../contexts/AppContext.jsx";
import './StateButton.css';
import { TipoUsuario, EstadoPedido } from "../../../enums.js";
import {cambiarEstadoPedido} from '../../services/pedidoService.js';

function PedidoAcciones({ pedido, onEstadoActualizado}) {
  const { currentUser } = useAuth();
  const [estado, setEstado] = useState(pedido.estadoNombre);
  const {updatePedido} = usePedidos()
  useEffect(() => { 
      setEstado(pedido.estadoNombre)
  }, [pedido.estadoNombre] )
  const esComprador = currentUser?.tipo === TipoUsuario.COMPRADOR;
  const esVendedor = currentUser?.tipo === TipoUsuario.VENDEDOR;

  const handleCambiarEstado = async (nuevoEstado) => {
        try {
            await updatePedido(pedido._id, nuevoEstado);
            
            if (onEstadoActualizado) {
                onEstadoActualizado();
            }
        } catch (error) {
            console.error('Error al cambiar estado:', error);
        }
  };

  const siguienteEstado = {
    [EstadoPedido.PENDIENTE]: EstadoPedido.CONFIRMADO,
    [EstadoPedido.CONFIRMADO]: EstadoPedido.EN_PREPARACION,
    [EstadoPedido.EN_PREPARACION]: EstadoPedido.ENVIADO,
    [EstadoPedido.ENVIADO]: EstadoPedido.ENTREGADO,
  };

  const handleCancelar = async () => {
    if (window.confirm("¿Estás seguro de que deseas cancelar este pedido?")) {
    try {
          const pedidoActualizado = await cambiarEstadoPedido(pedido._id, EstadoPedido.CANCELADO, currentUser.username);
          updatePedido(pedidoActualizado)
          setEstado(EstadoPedido.CANCELADO);
          if (onEstadoActualizado) {
          onEstadoActualizado();
        }
            } catch (error) {
                console.error("Error al cancelar el pedido:", error);
                alert("No se pudo cancelar el pedido. Por favor, intenta de nuevo.");
             }
       }
    };

    
    const handleSiguiente = async () => {
    const nuevoEstado = siguienteEstado[estado];
    if (nuevoEstado) {
      try{
      setEstado(nuevoEstado);
      const pedidoActualizado = await cambiarEstadoPedido(pedido._id, nuevoEstado, currentUser.username)
      updatePedido(pedidoActualizado);

      if (onEstadoActualizado) {onEstadoActualizado();}
      } catch (error) {
        console.error("Error al cambiar estado:", error);
        alert("No se pudo cambiar el estado del pedido.");
      }
    }
  };
    const puedeCancelar = ![
    EstadoPedido.CANCELADO,
    EstadoPedido.ENVIADO,
    EstadoPedido.ENTREGADO,
    ].includes(estado);

   return (
    <div className="botones" role="group" aria-label="Acciones del pedido">
      {esVendedor && siguienteEstado[estado] && (
        <button
          className="btn btn-primary"
          onClick={handleSiguiente}
          aria-label={`Cambiar estado a ${siguienteEstado[estado].replace("_", " ")}`}
        >
          Pasar a {siguienteEstado[estado].replace("_", " ")}
        </button>
      )}

      {puedeCancelar && (
        <button
          className="btn btn-danger"
          onClick={handleCancelar}
          aria-label="Cancelar pedido"
        >
          Cancelar pedido
        </button>
      )}
    </div>
  );
}

export default PedidoAcciones;
