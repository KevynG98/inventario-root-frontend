import axios from 'axios';

axios.defaults.withCredentials = true;

const API_URL = 'http://127.0.0.1:8000/';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('API_URL:', API_URL);

const getCsrfToken = async () => {
  try {
    const response = await apiClient.get('csrf/');
    return response.data.csrfToken;
  } catch (error) {
    console.error('Error al obtener CSRF token:', error);
    throw error;
  }
};

// Función para obtener el token de autenticación desde el localStorage
const getAuthToken = () => {
  const token = localStorage.getItem("token");
  console.log("TOKEN: ",token)
  return token || null;  // Si no hay token, retorna null
};

// Función para realizar solicitudes POST con el token CSRF y el token de autenticación (si existe)
const postData = async (endpoint, data) => {
  try {
    const csrfToken = await getCsrfToken();
    const authToken = getAuthToken();

    const headers = {
      'X-CSRFToken': csrfToken,
      ...(authToken && { 'Authorization': `Token ${authToken}` }),  // Solo se agrega el token de auth si existe
    };

    const response = await apiClient.post(endpoint, data, {
      headers: headers,
    });

    return response;
  } catch (error) {
    console.error('Error al enviar datos:', error);
    throw error;
  }
};

const getData = async (endpoint) => {
  try {
    const csrfToken = await getCsrfToken();
    const authToken = getAuthToken();

    const headers = {
      'X-CSRFToken': csrfToken,
      ...(authToken && { 'Authorization': `Token ${authToken}` }),
    };
    const response = await apiClient.get(endpoint, { headers });
    return response;
  } catch (error) {
    console.error(`Error al obtener datos de ${endpoint}:`, error);
    throw error;
  }
};

const deleteData = async (endpoint) => {
  try {
    const csrfToken = await getCsrfToken();
    const authToken = getAuthToken();

    const headers = {
      'X-CSRFToken': csrfToken,
      ...(authToken && { 'Authorization': `Token ${authToken}` }),
    };

    const response = await apiClient.delete(endpoint, { headers });

    return response;
  } catch (error) {
    console.error(`Error al eliminar datos en ${endpoint}:`, error);
    throw error;
  }
};


export default apiClient;
export { postData, getData, deleteData };
