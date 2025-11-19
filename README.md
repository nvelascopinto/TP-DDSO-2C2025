# Guía de Despliegue – Entrega 4

## Base de Datos - MongoDB Atlas

1. Crear un cluster  
Name: tienda_sol_db  
Provider: AWS  
Región: Sao Paulo (sa-east-1)

2. Crear un usuario  
Username: tienda-sol-db  
Password: root

3. Seleccionar My Local Environment

4. Añadir todas las IPs de Render a la IP Access List de MongoDB (se pueden obtener las IPs de render al presionar connect)

5. Luego de crear el cluster, presionar:  
connect -> compass -> copiar la url  
Esa será la MONGODB_PROD

## Backend - Render

1. Ir a new Web Service

2. En el código fuente usar una imagen existente de docker (una subida en docker hub usando los siguientes comandos:  
docker build  
docker push  
)

3. En el health check poner el path /health-check

4. Servicio: 2025-2c-grupo-10 (Región Oregon – Free).

    a. Variables de entorno (Render):  
    MONGODB_PROD = mongodb+srv://tienda-sol-db:root@cluster0.vcnaza6.mongodb.net/tienda_sol_db

## Frontend - Netlify

1. Conectar Netlify con GitHub

2. Hacer fork del repositorio en caso de no contar con permisos para Netlify

3. Sitio público tiendasol10.netlify.app

4. Repositorio conectado: Github  
Directorio base: /tienda-sol-frontend  
Build: npm install && npm run build  
Publish: /tienda-sol-frontend/dist  
Funciones: /tienda-sol-frontend/netlify/functions/

5. Variable de entorno:  
VITE_API_URL= https://tienda-sol-backend-v1-0.onrender.com

## Conexión y Verificación

El frontend usa VITE_API_URL para comunicarse con la API de render.

El backend debe permitir el dominio del frontend mediante la variable VITE_API_URL

Dominio: https://tiendasol10.netlify.app/
