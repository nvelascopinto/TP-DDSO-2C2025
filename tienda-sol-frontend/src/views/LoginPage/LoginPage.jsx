
import React, { useState } from 'react';
import { TipoUsuario } from '../../../enums.js';
import Button from '../../components/Button/Button.jsx';
import PasswordInput from '../../components/PasswordInput/PasswordInput.jsx';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
    const [activeTab, setActiveTab] = useState('comprador');

    const handleLogin = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
        username: formData.get('username'),
        password: formData.get('password')
        }
        onLogin(activeTab === 'comprador' ? TipoUsuario.COMPRADOR : TipoUsuario.VENDEDOR, data.username, data.password);


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
                            <label htmlFor="username" className="form-label">Nombre de Usuario*</label>
                            <input
                                type="text"
                                id="username"
                                name='username'
                                className="form-input"
                                placeholder="Ingresa tu nombre de usuario"
                                required
                                aria-label="Nombre de Usuario"
                                aria-required="true"
                            />
                        </div>
                        <PasswordInput
                            id="password"
                            name="password"
                            placeholder="••••••••"
                            aria-label="Contraseña"
                            aria-required="true"
                        />
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
