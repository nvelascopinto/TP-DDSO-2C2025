
import React from 'react';
import './Button.css';

const Button = ({ children, variant = 'primary', className, ...props }) => {
  const variantClass = variant === 'primary' ? 'button--primary' : 'button--secondary';

  return (
    <button
      className={`button ${variantClass} ${className || ''}`}
      role="button"
      aria-disabled={props.disabled ? "true" : "false"}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
