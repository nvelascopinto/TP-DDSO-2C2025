import React from "react";
import './InputForm.css'

export const InputForm = ({ label, type, name, ariaLabel, placeholder }) => {
    return  <div className="form-group">
                            <label htmlFor={name} className="form-label">{label}</label>
                            <input
                                type={type}
                                id={name}
                                name={name}
                                className="form-input"
                                placeholder={placeholder}
                                required 
                                aria-label= {ariaLabel}
                                aria-required="true"
                            />
                        </div>
}