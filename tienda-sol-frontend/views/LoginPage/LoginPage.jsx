
import React, { useState } from 'react';
import { TipoUsuario } from '../../enums.js';
import Button from '../../components/Button/Button.jsx';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
    const [activeTab, setActiveTab] = useState('comprador');

    const handleLogin = (e) => {
        e.preventDefault();
        onLogin(activeTab === 'comprador' ? TipoUsuario.COMPRADOR : TipoUsuario.VENDEDOR);
    };

    const getTabClasses = (tab) => {
        let classes = "login-form__tab";
        if (tab === activeTab) {
            classes += ` login-form__tab--active login-form__tab--${tab}`;
        }
        return classes;
    }

    return (
        <div className="login-page">
            <div className="login-form__container">
                <div className="login-form__tabs">
                    <button onClick={() => setActiveTab('comprador')} className={getTabClasses('comprador')}>
                        Soy Comprador
                    </button>
                    <button onClick={() => setActiveTab('vendedor')} className={getTabClasses('vendedor')}>
                        Soy Vendedor
                    </button>
                </div>

                <form onSubmit={handleLogin} className="login-form__body">
                    <h2 className="login-form__title">
                        Bienvenido de vuelta
                    </h2>
                    <p className="login-form__subtitle">
                        Ingresa tus datos para continuar
                    </p>

                    <div className="login-form__fields">
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="form-input"
                                placeholder="tu@email.com"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                className="form-input"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div className="login-form__actions">
                        <Button type="submit" variant={activeTab === 'comprador' ? 'primary' : 'secondary'} className="button--full-width">
                            Ingresar
                        </Button>
                    </div>

                    <p className="login-form__demo-note">
                        (Para esta demo, cualquier email/contraseña funcionará.)
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
