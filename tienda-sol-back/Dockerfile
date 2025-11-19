# Usamos una imagen base de Node.js versión 22, ligera (alpine)
FROM node:22-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos de definición de dependencias
# Esto ayuda a usar la caché de Docker si solo cambias el código fuente
COPY package*.json ./

# Instala solo las dependencias de producción (basado en tu script 'start')
# Si tu app necesitara dependencias de desarrollo en el runtime (algo raro), usa 'RUN npm install'
RUN npm install

# Copia el resto del código fuente del proyecto
COPY . .

# Expone el puerto que usa tu aplicación
EXPOSE 3000

# Comando para iniciar la aplicación en producción
CMD ["npm", "start"]