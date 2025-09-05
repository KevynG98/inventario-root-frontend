// apiService.js
import axios from 'axios';
import Swal from 'sweetalert2';

// Configuración general
const DEV = true; // Cambia a false para producción
const API_URL = DEV ? process.env.REACT_APP_API_URL_DEV : process.env.REACT_APP_API_URL_PROD;

// Cliente Axios
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000, // Aumentado para evitar errores por timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('API_URL:', API_URL);

// Obtener el token de autenticación desde localStorage
const getAuthToken = () => {
  const token = localStorage.getItem("token");
  console.log("TOKEN: ", token);
  return token || null;
};

// Obtener username del usuario logueado (para auditoría) desde localStorage
const getUsername = () => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const obj = typeof raw === 'string' ? JSON.parse(raw) : raw;
    const username = obj?.username || null;
    return username;
  } catch (e) {
    return null;
  }
};


// GET
const getData = async (endpoint, options = {}) => {
  try {
    const authToken = getAuthToken();
    const headers = {
      ...(authToken && { 'Authorization': `Token ${authToken}` }),
      ...(getUsername() && { 'X-User': getUsername() }),
    };
    const response = await apiClient.get(endpoint, { headers, ...options });
    return response;
  } catch (error) {
    console.error(`Error al obtener datos de ${endpoint}:`, error);
    throw error;
  }
};

// GET binary (e.g., PDF) with auth
const getBinary = async (endpoint, options = {}) => {
  try {
    const authToken = getAuthToken();
    const headers = {
      ...(authToken && { 'Authorization': `Token ${authToken}` }),
      ...(getUsername() && { 'X-User': getUsername() }),
    };
    const response = await apiClient.get(endpoint, { headers, responseType: 'blob', ...options });
    return response;
  } catch (error) {
    console.error(`Error al descargar binario de ${endpoint}:`, error.response ? error.response.data : error);
    throw error;
  }
};

// POST
const postData = async (endpoint, data, options = {}) => {
  try {
    const authToken = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Token ${authToken}` }),
      ...(getUsername() && { 'X-User': getUsername() }),
    };
    const response = await apiClient.post(endpoint, data, { headers, ...options });
    return response;
  } catch (error) {
    console.error('Error al enviar datos:', error.response ? error.response.data : error);
    throw error;
  }
};

// PUT
const putData = async (url, data, options = {}) => {
  try {
    if (!options.__skipLoader) {
      __loaderCount += 1;
      if (__loaderCount === 1) showGlobalLoader(options.__loaderTitle || 'Cargando...');
    }
    const authToken = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Token ${authToken}` }),
      ...(getUsername() && { 'X-User': getUsername() }),
    };
    const response = await fetch(`${API_URL}${url}`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(data),
    });
    const json = await response.json();
    return { status: response.status, data: json };
  } catch (error) {
    console.error(`Error al actualizar en ${url}:`, error);
    throw error;
  } finally {
    if (!options.__skipLoader) {
      __loaderCount = Math.max(0, __loaderCount - 1);
      if (__loaderCount === 0) hideGlobalLoader();
    }
  }
};

// PATCH
const patchData = async (endpoint, data, options = {}) => {
  try {
    const authToken = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Token ${authToken}` }),
      ...(getUsername() && { 'X-User': getUsername() }),
    };
    const response = await apiClient.patch(endpoint, data, { headers, ...options });
    return response;
  } catch (error) {
    console.error(`Error al hacer PATCH en ${endpoint}:`, error.response ? error.response.data : error);
    throw error;
  }
};

// DELETE
const deleteData = async (endpoint, options = {}) => {
  try {
    const authToken = getAuthToken();
    const headers = {
      ...(authToken && { 'Authorization': `Token ${authToken}` }),
      ...(getUsername() && { 'X-User': getUsername() }),
    };
    const response = await apiClient.delete(endpoint, { headers, ...options });
    return response;
  } catch (error) {
    console.error(`Error al eliminar datos en ${endpoint}:`, error);
    throw error;
  }
};

// Logout
const logout = async () => {
  try {
    const authToken = getAuthToken();
    const headers = {
      ...(authToken && { 'Authorization': `Token ${authToken}` }),
      'Content-Type': 'application/json',
      ...(getUsername() && { 'X-User': getUsername() }),
    };
    const response = await apiClient.post('user/logout/', {}, { headers });
    return response;
  } catch (error) {
    console.error('Error al cerrar sesión:', error.response ? error.response.data : error);
    throw error;
  }
};

// Exportar funciones
export default apiClient;
export { getData, getBinary, postData, putData, patchData, deleteData, logout, API_URL };

// --------------
// Global SweetAlert2 loader (aplica a todas las solicitudes Axios)
// --------------

let __loaderCount = 0;
let __loaderActive = false;

const showGlobalLoader = (title) => {
  try {
    if (!__loaderActive && !Swal.isVisible()) {
      __loaderActive = true;
      Swal.fire({
        title: title || 'Cargando... ',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        customClass: { popup: 'global-loader-popup' },
        didOpen: () => Swal.showLoading(),
      });
    }
  } catch (_) {
    // noop
  }
};

const hideGlobalLoader = () => {
  try {
    if (__loaderActive) {
      const popup = document.querySelector('.swal2-popup.global-loader-popup');
      if (popup) {
        Swal.close();
      }
    }
  } catch (_) {
    // noop
  } finally {
    __loaderActive = false;
  }
};

apiClient.interceptors.request.use((config) => {
  // Permite omitir el loader por petición: config.__skipLoader = true
  if (!config.__skipLoader) {
    __loaderCount += 1;
    if (__loaderCount === 1) showGlobalLoader(config.__loaderTitle || 'Cargando...');
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

const finalizeLoader = (config) => {
  if (!config || config.__skipLoader) return;
  __loaderCount = Math.max(0, __loaderCount - 1);
  if (__loaderCount === 0) hideGlobalLoader();
};

apiClient.interceptors.response.use((response) => {
  finalizeLoader(response?.config);
  return response;
}, (error) => {
  finalizeLoader(error?.config);
  return Promise.reject(error);
});
