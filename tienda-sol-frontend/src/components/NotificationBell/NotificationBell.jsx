
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AppContext.jsx';
import { api } from '../../services/mockService.js';
import './NotificationBell.css';

const NotificationBell = ({ onClick }) => {
    const { currentUser } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (currentUser) {
            const fetchNotifications = async () => {
                const notifs = await api.getNotificacionesNoLeidas(currentUser.id);
                setUnreadCount(notifs.length);
            };
            fetchNotifications();
            
            const interval = setInterval(fetchNotifications, 10000); // Poll for new notifications every 10 seconds
            return () => clearInterval(interval);
        }
    }, [currentUser]);

    return (
        <div className="notification-bell" onClick={onClick}>
            <span className="material-symbols-outlined" style={{ fontSize: "26px" }}>
                notifications
            </span>
            {unreadCount > 0 && (
                <span className="notification-bell__badge">{unreadCount}</span>
            )}
        </div>
    );
};

export default NotificationBell;
