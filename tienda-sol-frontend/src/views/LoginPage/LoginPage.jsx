
import React, { useState } from 'react';
import { TipoUsuario } from '../../../enums.js';
import Button from '../../components/Button/Button.jsx';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
    const [activeTab, setActiveTab] = useState('comprador');

    const handleLogin = (e) => {
        e.preventDefault();
        onLogin(activeTab === 'comprador' ? TipoUsuario.COMPRADOR : TipoUsuario.VENDEDOR);
    };

    
    return (
        <div className="login-page" role="main">    
            <div className="login-form__container" role="form" aria-label="Formulario de inicio de sesión">
                <div className="login-form__tab" role="heading">
                    Ingreso
                </div>

                <form onSubmit={handleLogin} className="login-form__body" aria-describedby="login-instructions">
                    <h2 className="login-form__title">
                        Bienvenido de vuelta
                    </h2>
                    <p className="login-form__subtitle">
                        Ingresa tus datos para continuar
                    </p>

                    <div className="login-form__fields">
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email*</label>
                            <input
                                type="email"
                                id="email"
                                className="form-input"
                                placeholder="tu@email.com"
                                required
                                aria-label="Correo electrónico"
                                aria-required="true"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Contraseña*</label>
                            <input
                                type="password"
                                id="password"
                                className="form-input"
                                placeholder="••••••••"
                                required
                                aria-required="true"
                                aria-label="Contraseña"
                            />
                        </div>
                    </div>

                    <div className="login-form__actions"  role="group" aria-label="Acciones del formulario">
                        <Button type="submit" variant={activeTab === 'comprador' ? 'primary' : 'secondary'} className="button--full-width">
                            Ingresar
                        </Button>
                    </div>

                    
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
