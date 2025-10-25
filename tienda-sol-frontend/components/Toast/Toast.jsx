
import React from 'react';
import './Toast.css';

const Toast = ({ message }) => {
  return (
    <div className="toast-notification">
      <p className="toast-notification__message">{message}</p>
    </div>
  );
};

export default Toast;
