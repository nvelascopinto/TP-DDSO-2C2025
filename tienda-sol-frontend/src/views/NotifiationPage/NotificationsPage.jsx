
import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AppContext.jsx';
//import { api } from '../../services/mockService.js';
import Spinner from '../../components/Spinner/Spinner.jsx';
import Button from '../../components/Button/Button.jsx';
import './NotificationsPage.css';
import {getNotificaciones, getNotificacionesNoLeidas, getNotificacionesLeidas, marcarNotificacionComoLeida} from '../../services/notificacionService.js';

const NotificationsPage = ({ navigateTo }) => {
  const { currentUser } = useAuth();
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  //const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('unread');

  /*const fetchNotifications = async () => {
    if (currentUser) {
      try {
        setLoading(true);
        const data = await notificacionService.getNotificaciones(currentUser.username);
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    }
  };*/

  /*useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);*/

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


  /*const filteredNotifications = useMemo(() => {
    switch (filter) {
      case 'read':
        return notifications.filter(n => n.leida);
      case 'unread':
        return notifications.filter(n => !n.leida);
      case 'all':
      default:
        return notifications;
    }
  }, [notifications, filter]); */




if (loading) {
    return <Spinner role="status"
        aria-busy="true"
        aria-live="polite"
        aria-label="Cargando notificaciones"/>;
  }

  return (
    <div className="notifications-page" role="main">
      <div className="notifications-page__header">
        <h1 className="notifications-page__title">Notificaciones</h1>
        <div className="notifications-page__filter"  aria-label="Filtro de notificaciones">
          <label htmlFor="notif-filter"  value={filter}>Mostrar:</label>
          <select
            id="notif-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="unread">No Leídas</option>
            <option value="read">Leídas</option>
            <option value="all">Todas</option>
          </select>
        </div>
      </div>

      {filteredNotifications.length === 0 ? (
        <p className="notifications-page__empty-message">
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
              {!notif.leida && (
                <button
                  onClick={() => handleMarkAsRead(notif._id)}
                  className="notification-item__action"
                >
                  Marcar como leída
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="notifications-page__footer">
        <Button onClick={() => navigateTo('home')} variant="secondary">
          Volver a la tienda
        </Button>
      </div>
    </div>
  );
};

export default NotificationsPage;
