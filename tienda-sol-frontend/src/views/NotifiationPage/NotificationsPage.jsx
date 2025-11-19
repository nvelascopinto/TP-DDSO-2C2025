import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AppContext.jsx';
import Spinner from '../../components/Spinner/Spinner.jsx';
import Button from '../../components/Button/Button.jsx';
import './NotificationsPage.css';
import {getNotificaciones, getNotificacionesNoLeidas, getNotificacionesLeidas, marcarNotificacionComoLeida} from '../../services/notificacionService.js';

const NotificationsPage = ({ navigateTo }) => {
  const { currentUser } = useAuth();
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('unread');

  useEffect(() => {
  const fetchFilteredNotifications = async () => {
    setLoading(true);
    try {
      let result;
      switch (filter) {
        case 'read':
          result = await getNotificacionesLeidas(currentUser.username);
          break;
        case 'unread':
          result = await getNotificacionesNoLeidas(currentUser.username);
          break;
        case 'all':
        default:
          result = await getNotificaciones(currentUser.username); 
          break;
      }
      setFilteredNotifications(result);
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  if (currentUser?.username) {
    fetchFilteredNotifications();
  }
}, [filter, currentUser.username]);

  const handleMarkAsRead = async (id) => {
    try {
      await marcarNotificacionComoLeida(id, currentUser.username);
      setFilteredNotifications(prev =>
       prev.map(n => n._id === id ? { ...n, leida: true } : n)
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };


if (loading) {
    return <Spinner role="status"
        aria-busy="true"
        aria-live="polite"
        aria-label="Cargando notificaciones"/>;
  }

  return (
    <div className="notifications-page" role="main" aria-labelledby="notifications-title">
      <div className="notifications-page__header">
        <h1 className="notifications-page__title">Notificaciones</h1>
        <div className="notifications-page__filter"  aria-label="Filtro de notificaciones">
          <label htmlFor="notif-filter"  value={filter}>Mostrar:</label>
          <select
            id="notif-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
            aria-label="Filtrar notificaciones por estado"
            >
            <option value="unread">No Leídas</option>
            <option value="read">Leídas</option>
            <option value="all">Todas</option>
          </select>
        </div>
      </div>

      {filteredNotifications.length === 0 ? (
        <p className="notifications-page__empty-message" role="status" aria-live="polite">
          {filter === 'read' ? 'No tienes notificaciones leídas.' : 'No tienes notificaciones nuevas.'}
        </p>
      ) : (
        <div className="notifications-list">
          {filteredNotifications.map((notif) => (
            <div key={notif._id} className={`notification-item ${notif.leida ? 'notification-item--read' : ''}`}>
              <div className="notification-item__content">
                <p className="notification-item__message">{notif.mensaje}</p>
                <p className="notification-item__date">
                  {new Date(notif.fechaAlta).toLocaleString()}
                </p>
              </div>
              <div className='buttons-notificaciones'>
              {!notif.leida && (
                <div aria-label="Marcar esta notificación como leída" >
                <Button
                  onClick={() => handleMarkAsRead(notif._id)}
                >
                  Marcar como leída
                </Button>
                </div>
              )}
                {notif.pedido && (
                <Button 
                  onClick={() => { 
                        navigateTo(`historial-pedidos/${notif.pedido}`, null, notif.pedido)}}
                  aria-label={`Ver detalles del pedido ${notif.pedido}`}
                  className="notification-item__action"
                >
                  Ver Pedido
                </Button> 
              )}
            </div>
            </div>
          ))}
        </div>
      )}
      <div className="notifications-page__footer">
        <Button onClick={() => navigateTo('home')} variant="primary">
          Volver a la tienda
        </Button>
      </div>
    </div>
  );
};

export default NotificationsPage;
