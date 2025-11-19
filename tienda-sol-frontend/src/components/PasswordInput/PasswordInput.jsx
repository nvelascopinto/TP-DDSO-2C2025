import React, { useState } from 'react';
import './PasswordInput.css';

const PasswordInput = ({ id, name, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">Contraseña*</label>
      <div className="password-wrapper">
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          name={name}
          className="form-input"
          placeholder={placeholder}
          required
          minLength={8}
        />
        <span
          className="material-symbols-outlined password-icon"
          onClick={() => setShowPassword(!showPassword)}
        >
            {showPassword ? "visibility" : "visibility_off"}
        </span>
      </div>
        <p className='aviso__contraseña'>La contraseña debe tener al menos 8 caracteres</p>
    </div>
  );
};

export default PasswordInput;