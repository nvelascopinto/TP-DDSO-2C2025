import {apiBack} from "./apiBack.js"


export function authenticate(user, password) {
    return apiBack.post('/sesiones', {
        username : user, 
        password : password
    }).then((response) => {
        return response.data
    })
}

export function getPedidos(id) {
  return apiBack.get(`/usuarios/${id}/pedidos`,
    {
      headers: { 'X-User': id }
    }
  )
  .then((response) => {
    return response.data
  })
}

export function registerUser(userData) {
  return apiBack.post('/usuarios', userData)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error.response && error.response.status === 409) {
        return { error: "El usuario ya existe" };
      }
      throw error;
    });
}

export function getVendedores() {
  return apiBack.get('/usuarios/tiendas')
    .then((response) => {
      return response.data;
    })
}

export function getUserData(username) {
  return apiBack.get(`/usuarios/${username}`)
    .then((response) => {
      return response.data;
    })
}