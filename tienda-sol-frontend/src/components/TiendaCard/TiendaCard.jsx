import React from "react"
import './TiendaCard.css'
export const TiendaCard = ({ vendedor, onStoreSelect }) => {      
    return <div
              className="homepage__store-card"
              role="button"
              aria-label={'Abrir catálogo de la tienda' + vendedor.tienda.nombre}
              onClick={() => onStoreSelect(vendedor)}
            >
              <h2 className="store-card__title">{vendedor.tienda.nombre}</h2>
              <div className="store-card__description">
                <p className="store-card__desc">{vendedor.tienda.descripcion}</p>
              </div>
              <div className='store-card__catalogo'>
                <p className="store-card__cta">Ver catálogo</p>
              </div>
            </div>
}