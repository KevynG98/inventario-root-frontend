import axios from 'axios';
import Swal from 'sweetalert2';

// 🌍 Detección de entorno
const DEV = process.env.REACT_APP_DEVELOPMENT === 'true';

// 🔗 Detección dinámica del backend según IP / entorno
const currentHost = window.location.hostname;

let API_URL;
if (DEV) {
  if (currentHost.startsWith("172.") || currentHost.startsWith("10.") || currentHost.startsWith("192.")) {
    // Si estás accediendo desde LAN o ZeroTier
    API_URL = `http://${currentHost}:8077/`;
  } else {
    // Localhost puro
    API_URL = process.env.REACT_APP_API_URL_DEV;
  }
} else {
  API_URL = process.env.REACT_APP_API_URL_PROD;
}

// --- Cliente Axios ---
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('%c🌐 API_URL:', 'color: #4CAF50; font-weight: bold;', API_URL);

// --- Helpers para auth ---
const getAuthToken = () => localStorage.getItem("token") || null;

const getUsername = () => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const obj = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return obj?.username || null;
  } catch {
    return null;
  }
};

// --- Métodos HTTP base ---
const getData = async (endpoint, options = {}) => {
  const authToken = getAuthToken();
  const headers = {
    ...(authToken && { 'Authorization': `Token ${authToken}` }),
    ...(getUsername() && { 'X-User': getUsername() }),
  };
  return apiClient.get(endpoint, { headers, ...options });
};

const getBinary = async (endpoint, options = {}) => {
  const authToken = getAuthToken();
  const headers = {
    ...(authToken && { 'Authorization': `Token ${authToken}` }),
    ...(getUsername() && { 'X-User': getUsername() }),
  };
  return apiClient.get(endpoint, { headers, responseType: 'blob', ...options });
};

const postData = async (endpoint, data, options = {}) => {
  const authToken = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(authToken && { 'Authorization': `Token ${authToken}` }),
    ...(getUsername() && { 'X-User': getUsername() }),
  };
  return apiClient.post(endpoint, data, { headers, ...options });
};

const putData = async (url, data, options = {}) => {
  const authToken = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(authToken && { 'Authorization': `Token ${authToken}` }),
    ...(getUsername() && { 'X-User': getUsername() }),
  };
  const response = await fetch(`${API_URL}${url}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  });
  const json = await response.json();
  return { status: response.status, data: json };
};

const patchData = async (endpoint, data, options = {}) => {
  const authToken = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(authToken && { 'Authorization': `Token ${authToken}` }),
    ...(getUsername() && { 'X-User': getUsername() }),
  };
  return apiClient.patch(endpoint, data, { headers, ...options });
};

const deleteData = async (endpoint, options = {}) => {
  const authToken = getAuthToken();
  const headers = {
    ...(authToken && { 'Authorization': `Token ${authToken}` }),
    ...(getUsername() && { 'X-User': getUsername() }),
  };
  return apiClient.delete(endpoint, { headers, ...options });
};

const logout = async () => {
  const authToken = getAuthToken();
  const headers = {
    ...(authToken && { 'Authorization': `Token ${authToken}` }),
    'Content-Type': 'application/json',
    ...(getUsername() && { 'X-User': getUsername() }),
  };
  return apiClient.post('user/logout/', {}, { headers });
};

// --- Exportar funciones ---
export default apiClient;
export { getData, getBinary, postData, putData, patchData, deleteData, logout, API_URL };

// --- SweetAlert2 Loader global ---
let __loaderCount = 0;
let __loaderActive = false;

const showGlobalLoader = (title) => {
  try {
    if (!__loaderActive && !Swal.isVisible()) {
      __loaderActive = true;
      Swal.fire({
        title: title || 'Cargando...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        customClass: { popup: 'global-loader-popup' },
        didOpen: () => Swal.showLoading(),
      });
    }
  } catch {}
};

const hideGlobalLoader = () => {
  try {
    if (__loaderActive) {
      const popup = document.querySelector('.swal2-popup.global-loader-popup');
      if (popup) Swal.close();
    }
  } catch {} finally {
    __loaderActive = false;
  }
};

// --- Interceptores globales ---
apiClient.interceptors.request.use((config) => {
  if (!config.__skipLoader) {
    __loaderCount += 1;
    if (__loaderCount === 1) showGlobalLoader(config.__loaderTitle || 'Cargando...');
  }
  return config;
}, Promise.reject);

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