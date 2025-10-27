import React, { useState } from 'react';
import { TipoUsuario } from '../../../enums.js';
import Button from '../../components/Button/Button.jsx';
import './RegisterPage.css';

const RegisterPage = ({ onRegister }) => {
    const [userType, setUserType] = useState("comprador");

     const handleRegister = (e) => {
            e.preventDefault();
            onRegister(userType === 'comprador' ? TipoUsuario.COMPRADOR : TipoUsuario.VENDEDOR);
        };
         const getTabClasses = (tab) => {
        let classes = "register-form__tab";
        if (tab === userType) {
            classes += ` register-form__tab--active register-form__tab--${tab}`;
        }
        return classes;
    }
    return (
        <div className="register-page">
            <div className="register-form__container">
                <div className="register-form__tabs">
                    <button onClick={() => setUserType('comprador')} className={getTabClasses('comprador')}>
                        Soy Comprador
                    </button>
                    <button onClick={() => setUserType('vendedor')} className={getTabClasses('vendedor')}>
                        Soy Vendedor
                    </button>
                </div>
                <form onSubmit={handleRegister} className="register-form__body">
                    
                    <h2 className="register-form__title">
                        Crea tu cuenta
                    </h2>
                    <p className="register-form__subtitle">
                        Ingresa tus datos para registrarte
                    </p>
                    
                    <div className="register-form__fields">  
                        <div className="form-group">
                            <label htmlFor="Nombre de Usuario" className="form-label">Nombre de Usuario*</label>
                            <input
                                type="text"
                                id="username"
                                className="form-input"
                                placeholder=" Ingresa tu nombre de usuario"
                                required
                            />
                        </div>   
                        <div className="form-group">
                            <label htmlFor="contraseña" className="form-label">Contraseña*</label>
                            <input
                                type="password"
                                id="contraseña"
                                className="form-input"
                                placeholder=" Ingresa tu contraseña"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email*</label>
                            <input
                                type="email"
                                id="email"
                                className="form-input"
                                placeholder=" Ingresa tu email de contacto"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="telefono" className="form-label">Teléfono*</label>
                            <input
                                type="tel"
                                id="telefono"
                                className="form-input"
                                placeholder=" Ingresa tu número de teléfono"
                                required
                            />
                        </div>
                    </div>
                    <div>   
                        {userType === 'vendedor' ? (
                        <div>
                            <p className='register-form__subtitle'>Ingresa los datos de tu tienda para terminar</p>
                            <div className="register-form__fields">  
                        <div className="form-group">
                            <label htmlFor="Nombre de la tienda" className="form-label">Nombre de la tienda*</label>
                            <input
                                type="text"
                                id="storeName"
                                className="form-input"
                                placeholder=" Ingresa el nombre de tu tienda"
                                required
                            />
                        </div>   
                        <div className="form-group">
                            <label htmlFor="descripcion" className="form-label">Descripción*</label>
                            <input
                                type="text"
                                id="descripcion"
                                className="form-input"
                                placeholder=" Ingresa una descripción de tu tienda"
                                required
                            />
                        </div>
                        </div>
                    </div>
                        ) : null}
                    </div>
                    <div className='register-form___actions'>
                        <Button type="submit" variant={userType === 'comprador' ? 'primary' : 'secondary'} className="button--full-width">
                            Registrarse
                        </Button>
                    </div>
                </form>     
         </div>
    </div>
    );
};

export default RegisterPage;
