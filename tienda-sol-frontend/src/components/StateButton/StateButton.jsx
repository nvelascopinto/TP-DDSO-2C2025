import React, { useState } from "react";
import { useAuth, usePedidos } from "../../contexts/AppContext.jsx";
import './StateButton.css';
import { TipoUsuario, EstadoPedido } from "../../services/mockService.js";

function PedidoAcciones({ pedido}) {
  const { currentUser } = useAuth();
  const [estado, setEstado] = useState(pedido.estado);
  const {updatePedido} = usePedidos()

  const esComprador = currentUser?.tipo === TipoUsuario.COMPRADOR;
  const esVendedor = currentUser?.tipo === TipoUsuario.VENDEDOR;

  // Estados finales donde no hay botones visibles
  const estadosFinales = [EstadoPedido.CANCELADO, EstadoPedido.ENVIADO, EstadoPedido.ENTREGADO];
  if (estadosFinales.includes(estado)) return null;

  // --- Acciones y sus efectos visuales ---
  const handleCancelar = async () => {
    //onCancelar(pedido.id);
    setEstado(EstadoPedido.CANCELADO);
    updatePedido(pedido)
    if (window.confirm("¿Estás seguro de que deseas cancelar este pedido?")) {
    try {
          const pedidoActualizado = await api.cancelarPedido(pedido.id);
          updatePedido(pedidoActualizado)
          alert("Pedido cancelado exitosamente.");
            } catch (error) {
                console.error("Error al cancelar el pedido:", error);
                alert("No se pudo cancelar el pedido. Por favor, intenta de nuevo.");
             }
       }
  };

  const handleConfirmar = () => {
    //onConfirmar(pedido.id);
    setEstado(EstadoPedido.CONFIRMADO);
    updatePedido(pedido)
  };

  const handleEnviar = () => {
   // onEnviar(pedido.id);
    setEstado(EstadoPedido.ENVIADO);
    updatePedido(pedido)
  };

const handlePreparar = () => {
   // onPreparar(pedido.id);
    setEstado(EstadoPedido.EN_PREPARACION);
    updatePedido(pedido)
  };

  // --- Botones dinámicos ---
  let botones = [];

  // Rol: Comprador
  if (esComprador) {
    const puedeCancelar = [EstadoPedido.PENDIENTE,EstadoPedido.CONFIRMADO,EstadoPedido.EN_PREPARACION].includes(estado);
    botones.push(
      <button
        key="cancelar"
        onClick={handleCancelar}
        className="order-item__cancel-button"
        disabled={!puedeCancelar}
      >
        Cancelar Pedido
      </button>
    );
  }

  //  Rol: Vendedor
  if (esVendedor) {
    const puedeConfirmar = estado == EstadoPedido.PENDIENTE;
    const puedePreparar = estado == EstadoPedido.CONFIRMADO;
    const puedeEnviar = EstadoPedido.EN_PREPARACION;

    botones.push(
      <button
        key="confirmar"
        onClick={handleConfirmar}
        className="order-item__confirm-button"
        disabled={!puedeConfirmar}
      >
        Confirmar
      </button>
    );

    botones.push(
      <button
        key="enviar"
        onClick={handleEnviar}
        className="order-item__send-button"
        disabled={!puedeEnviar}
      >
        Enviar
      </button>
    );

    botones.push(
      <button
        key="preparar"
        onClick={handlePreparar}
        className="order-item__preparar-button"
        disabled={!puedePreparar}
      >
        Preparar
      </button>
    );
  }

  // 🔸 Si todos están deshabilitados, no se muestran
  const hayActivo = botones.some((b) => !b.props.disabled);
  if (!hayActivo) return null;

  return <div className="order-item__actions">{botones}</div>;
}

export default PedidoAcciones;
