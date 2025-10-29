import React, { useState } from 'react';
import { TipoUsuario } from '../../../enums.js';
import Button from '../../components/Button/Button.jsx';
import PasswordInput from '../../components/PasswordInput/PasswordInput.jsx';
import './RegisterPage.css';

const RegisterPage = ({ onRegister }) => {
  const [userType, setUserType] = useState("Comprador");
  const [errorMsg, setErrorMsg] = useState(null);

  // manejo el envío del formulario
  const handleRegister = (e) => {
    e.preventDefault();
    setErrorMsg(null); // limpia error anterior

    const formData = new FormData(e.target);
    const data = {
      username: formData.get('username'),
      password: formData.get('password'),
      email: formData.get('email'),
      nombre: formData.get('name'),
      telefono: formData.get('telefono'),
      tipoUsuario: userType,
      ...(userType === 'vendedor' && {
        tienda: {
        nombre: formData.get('storeName'),
        descripcion: formData.get('descripcion'),
    }
  }),
};

    onRegister(
      userType === 'comprador' ? TipoUsuario.COMPRADOR : TipoUsuario.VENDEDOR,
      data
    ).then((result) => {
      if (result?.error) {
        setErrorMsg(result.error);
      }
    });
  };

  // Clases para las pestañas "Soy Comprador / Soy Vendedor"
  const getTabClasses = (tab) => {
    let classes = "register-form__tab";
    if (tab === userType) {
      classes += ` register-form__tab--active register-form__tab--${tab}`;
    }
    return classes;
  };

  return (
    <div className="register-page" role="main" aria-labelledby="register-title">
      <div className="register-form__container">
        {/* Tabs de tipo de usuario */}
        <div className="register-form__tabs" role="tablist" aria-label="Tipo de cuenta a registrar">
          <button onClick={() => setUserType('comprador')} className={getTabClasses('comprador')} aria-selected={userType === 'comprador'} aria-controls="panel-comprador">
            Soy Comprador
          </button>
          <button onClick={() => setUserType('vendedor')} className={getTabClasses('vendedor')} aria-selected={userType === 'vendedor'} aria-controls="panel-vendedor">
            Soy Vendedor
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleRegister} className="register-form__body" role="form">
          <h2 className="register-form__title">Crea tu cuenta</h2>
          <p className="register-form__subtitle">Ingresa tus datos para registrarte</p>

          {/* Mensaje de error */}
          {errorMsg && <p className="register-form__error" role="alert">{errorMsg}</p>}

          <div className="register-form__fields">
            <div className="form-group">
              <label htmlFor="username" className="form-label">Nombre de Usuario*</label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-input"
                placeholder="Ingresa tu nombre de usuario"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="name" className="form-label">Nombre y Apellido*</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                placeholder="Ingresa tu nombre y apellido"
                required
              />
            </div>

            <PasswordInput
              id="password"
              name="password"
              placeholder="********"
              aria-label="Contraseña"
              aria-required="true"
            />

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email*</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="Ingresa tu email de contacto"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefono" className="form-label">Teléfono*</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                className="form-input"
                placeholder="Ingresa tu número de teléfono"
                required
              />
            </div>
          </div>

          {/* Campos extra si el usuario es vendedor */}
          {userType === 'vendedor' && (
            <>
              <p className="register-form__subtitle">Ingresa los datos de tu tienda para terminar</p>
              <div className="register-form__fields" aria-live="polite">
                <div className="form-group">
                  <label htmlFor="storeName" className="form-label">Nombre de la tienda*</label>
                  <input
                    type="text"
                    id="storeName"
                    name="storeName"
                    className="form-input"
                    placeholder="Ingresa el nombre de tu tienda"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="descripcion" className="form-label">Descripción*</label>
                  <input
                    type="text"
                    id="descripcion"
                    name="descripcion"
                    className="form-input"
                    placeholder="Ingresa una descripción de tu tienda"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="register-form__actions">
            <Button
              type="submit"
              variant={userType === 'comprador' ? 'primary' : 'secondary'}
              className="button--full-width" aria-label={
              userType === 'comprador'
              ? 'Registrarse como comprador'
              : 'Registrarse como vendedor'
          }
            >
              Registrarse
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
