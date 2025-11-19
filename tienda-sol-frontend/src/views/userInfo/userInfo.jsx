import React, { useEffect, useState } from 'react';
import './userInfo.css';
import {useAuth} from "../../contexts/AppContext.jsx"
import { getUserData } from '../../services/userService.js';
import Button from '../../components/Button/Button.jsx';

const UserProfile = ({navigateTo}) => {
  const [isEditing, setIsEditing] = useState(false);
  const {currentUser} = useAuth();
  const [formData, setFormData] = useState(null); 
  
  const fetchUser = async () => {
    try {
        setIsEditing(true);
        console.log("ENTRA A OBTENER EL USUARIO");
        const data = await getUserData(currentUser.username);
        setFormData(data);
    } catch (error) {
        console.error("Error fetching user:", error);
    } finally {
        setIsEditing(false);
    }
  }
  
  useEffect(() => {
    if (currentUser) { 
      fetchUser();
    }
  }, [currentUser]);
  
  if (isEditing || !formData) {
    return (
      <div className="profile-container">
        <div>Cargando...</div>
      </div>
    );
  }
  
  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <span className="material-symbols-outlined">person</span>
          </div>
          <h1 className="profile-title">{formData.nombre || 'Usuario'}</h1>
          <p className="profile-subtitle">@{formData.username}</p>
        </div>
        
        <div className="profile-info">
          <div className="info-section">
            <h2 className="section-title">Información Personal</h2>
            
            <div className="info-item">
              <span className="info-label">Nombre de usuario</span>
              <span className="info-value">{formData.username}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Nombre completo</span>
              <span className="info-value">{formData.nombre}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email</span>
              <span className="info-value">{formData.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Teléfono</span>
              <span className="info-value">{formData.telefono || 'No especificado'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Tipo de usuario</span>
              <span className="span-value badge">{formData.tipoUsuario}</span>
            </div>
            {formData.tienda && (
              <div className="info-item">
                <span className="info-label">Tienda</span>
                <span className="info-value">{formData.tienda.nombre}</span>
              </div>
            )}
          </div>
                  <div className="profile-actions">
          <Button 
            variant="secondary" 
            onClick={() => navigateTo('home')}
          >
            Volver
          </Button>
        </div>

        </div>

      </div>       
      </div>
  );
};

export default UserProfile;