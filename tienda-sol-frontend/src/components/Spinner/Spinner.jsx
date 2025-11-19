
import React from 'react';
import './Spinner.css';

const Spinner = () => {
  return (
    <div 
      className="spinner-container" 
      role="status" 
      aria-live="polite"
      aria-label="Cargando contenido"
    >
      <div className="spinner"></div>
      <span className="visually-hidden">Cargando...</span>
    </div>
  );
};

export default Spinner;
