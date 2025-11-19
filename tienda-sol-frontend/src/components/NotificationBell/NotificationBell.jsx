import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AppContext.jsx';
import './NotificationBell.css';
import {getNotificacionesNoLeidas }from '../../services/notificacionService.js';

const NotificationBell = ({ onClick }) => {
    const { currentUser } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (currentUser) {
            const fetchNotifications = async () => {
                const notifs = await getNotificacionesNoLeidas(currentUser.username);
                setUnreadCount(notifs.length);
            };
            fetchNotifications();
            
            const interval = setInterval(fetchNotifications, 10000);
            return () => clearInterval(interval);
        }
    }, [currentUser]);

    return (
        <div className="notification-bell" onClick={onClick}>
            <span className="material-symbols-outlined icon">
                notifications
            </span>
            {unreadCount > 0 && (
                <span className="notification-bell__badge">{unreadCount}</span>
            )}
        </div>
    );
};

export default NotificationBell;