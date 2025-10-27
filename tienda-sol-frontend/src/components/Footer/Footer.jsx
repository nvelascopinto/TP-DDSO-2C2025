
import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer__content">
        <p>&copy; {new Date().getFullYear()} Tienda Sol. Todos los derechos reservados.</p>
        <p className="footer__subtitle">Plataforma de Comercio Electrónico - UTN.BA</p>
      </div>
    </footer>
  );
};

export default Footer;
