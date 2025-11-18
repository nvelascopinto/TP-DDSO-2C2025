
import React, { useState } from 'react';
import { TipoUsuario } from '../../../enums.js';
import Button from '../../components/Button/Button.jsx';
import PasswordInput from '../../components/PasswordInput/PasswordInput.jsx';
import './LoginPage.css';
import {InputForm} from "../../components/InputForm/InputForm.jsx"
const LoginPage = ({ onLogin }) => {
    const [activeTab, setActiveTab] = useState('comprador');
    const [errorMsg, setErrorMsg] = useState(null);

    const handleLogin = (e) => {
        e.preventDefault();
        setErrorMsg(null)

        const formData = new FormData(e.target);
        const data = {
        username: formData.get('username'),
        password: formData.get('password')
        }

        onLogin(
            activeTab === 'comprador' ? TipoUsuario.COMPRADOR : TipoUsuario.VENDEDOR,
            data.username,
            data.password
        ).then(()=>{}).catch((error) => {
        if (error?.response) {
        const msg = error.response.message.toLowerCase();
        if (msg.includes('contraseña') || msg.includes('password')) {
          setErrorMsg('La contraseña ingresada es incorrecta.');
        } else {
          setErrorMsg(error.response.message);
        }
        }
    })
    .catch(() => {
      setErrorMsg('La contraseña/usuarios ingresados son incorrectos.');
    });
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
                    {errorMsg && <p className="login-form__error" role="alert"  aria-live="assertive"> {errorMsg} </p>}
                    <div className="login-form__fields">
                        <InputForm
                            label="Nombre de usuario"
                            type="text"
                            name="username"
                            placeholder="Ingresa tu nombre de usuario"
                            ariaLabel="Nombre de usuario"
                        />
                        <PasswordInput
                            id="password"
                            name="password"
                            placeholder="********"
                            aria-label="Contraseña"
                            aria-required="true"
                        />
                    </div>

                    <div className="login-form__actions"  role="group" aria-label="Ingresar al sistema">
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
