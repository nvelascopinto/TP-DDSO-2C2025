import React, { useState } from 'react';
import './InputForm.css'

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
        />
        <span
          className="password-icon"
          onClick={() => setShowPassword(!showPassword)}
        >
            {showPassword ? "visibility" : "visibility_off"}
        </span>
      </div>
    </div>
  );
};

export default PasswordInput;