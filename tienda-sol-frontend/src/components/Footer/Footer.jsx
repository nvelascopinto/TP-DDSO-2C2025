import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer 
      className="footer" 
      role="contentinfo"
      aria-label="Información del sitio"
    >
      <div className="container footer__content">
        <p className="footer__subtitle">
          &copy; {new Date().getFullYear()} Tienda Sol. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
