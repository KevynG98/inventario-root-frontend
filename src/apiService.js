import axios from 'axios';
import Swal from 'sweetalert2';

// =============================================================
// 🌍 SMART ENVIRONMENT DETECTION (LAN / ZeroTier / Localhost)
// =============================================================
const DEV = process.env.REACT_APP_DEVELOPMENT === 'true';
const currentHost = window.location.hostname;
let API_URL;

if (DEV) {
  if (currentHost.startsWith("10.")) {
    // 🖥️ Red LAN interna
    API_URL = "http://10.10.20.16:8077/";
    console.log("📡 Detectado acceso LAN → usando backend LAN");
  } else if (currentHost.startsWith("172.")) {
    // 🌐 Red ZeroTier
    API_URL = "http://172.25.146.246:8077/";
    console.log("🌍 Detectado acceso ZeroTier → usando backend ZeroTier");
  } else if (currentHost === "localhost" || currentHost === "127.0.0.1") {
    // 💻 Localhost (desarrollo local)
    API_URL = process.env.REACT_APP_API_URL_DEV || "http://127.0.0.1:8077/";
    console.log("🧪 Detectado entorno local → usando backend local");
  } else {
    // Fallback
    API_URL = process.env.REACT_APP_API_URL_PROD || "http://10.10.20.16:8077/";
    console.log("⚙️ Default fallback → usando backend producción LAN");
  }
} else {
  // Producción (build compilado)
  API_URL = process.env.REACT_APP_API_URL_PROD || "http://10.10.20.16:8077/";
  console.log("🏭 Modo producción → backend LAN");
}

console.log("%c🌐 API_URL:", "color: #4CAF50; font-weight: bold;", API_URL);

// =============================================================
// 🚀 AXIOS CLIENT
// =============================================================
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// =============================================================
// 🔐 AUTH HELPERS
// =============================================================
const getAuthToken = () => {
  const token = localStorage.getItem("token");
  console.log("TOKEN:", token);
  return token || null;
};

const getUsername = () => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const obj = typeof raw === "string" ? JSON.parse(raw) : raw;
    return obj?.username || null;
  } catch {
    return null;
  }
};

// =============================================================
// 🧾 API METHODS
// =============================================================

// GET
const getData = async (endpoint, options = {}) => {
  try {
    const authToken = getAuthToken();
    const headers = {
      ...(authToken && { Authorization: `Token ${authToken}` }),
      ...(getUsername() && { "X-User": getUsername() }),
    };
    const response = await apiClient.get(endpoint, { headers, ...options });
    return response;
  } catch (error) {
    console.error(`❌ Error al obtener datos de ${endpoint}:`, error);
    throw error;
  }
};

// GET (BINARIO)
const getBinary = async (endpoint, options = {}) => {
  try {
    const authToken = getAuthToken();
    const headers = {
      ...(authToken && { Authorization: `Token ${authToken}` }),
      ...(getUsername() && { "X-User": getUsername() }),
    };
    const response = await apiClient.get(endpoint, {
      headers,
      responseType: "blob",
      ...options,
    });
    return response;
  } catch (error) {
    console.error(`❌ Error al descargar binario de ${endpoint}:`, error);
    throw error;
  }
};

// POST
const postData = async (endpoint, data, options = {}) => {
  try {
    const authToken = getAuthToken();
    const headers = {
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Token ${authToken}` }),
      ...(getUsername() && { "X-User": getUsername() }),
    };
    const response = await apiClient.post(endpoint, data, { headers, ...options });
    return response;
  } catch (error) {
    console.error("❌ Error al enviar datos:", error.response?.data || error);
    throw error;
  }
};

// PUT
const putData = async (url, data, options = {}) => {
  try {
    if (!options.__skipLoader) {
      __loaderCount += 1;
      if (__loaderCount === 1) showGlobalLoader(options.__loaderTitle || "Cargando...");
    }
    const authToken = getAuthToken();
    const headers = {
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Token ${authToken}` }),
      ...(getUsername() && { "X-User": getUsername() }),
    };
    const response = await fetch(`${API_URL}${url}`, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(data),
    });
    const json = await response.json();
    return { status: response.status, data: json };
  } catch (error) {
    console.error(`❌ Error al actualizar en ${url}:`, error);
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
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Token ${authToken}` }),
      ...(getUsername() && { "X-User": getUsername() }),
    };
    const response = await apiClient.patch(endpoint, data, { headers, ...options });
    return response;
  } catch (error) {
    console.error(`❌ Error al hacer PATCH en ${endpoint}:`, error);
    throw error;
  }
};

// DELETE
const deleteData = async (endpoint, options = {}) => {
  try {
    const authToken = getAuthToken();
    const headers = {
      ...(authToken && { Authorization: `Token ${authToken}` }),
      ...(getUsername() && { "X-User": getUsername() }),
    };
    const response = await apiClient.delete(endpoint, { headers, ...options });
    return response;
  } catch (error) {
    console.error(`❌ Error al eliminar datos en ${endpoint}:`, error);
    throw error;
  }
};

// LOGOUT
const logout = async () => {
  try {
    const authToken = getAuthToken();
    const headers = {
      ...(authToken && { Authorization: `Token ${authToken}` }),
      "Content-Type": "application/json",
      ...(getUsername() && { "X-User": getUsername() }),
    };
    const response = await apiClient.post("user/logout/", {}, { headers });
    return response;
  } catch (error) {
    console.error("❌ Error al cerrar sesión:", error);
    throw error;
  }
};

// =============================================================
// 🌀 GLOBAL SWEETALERT2 LOADER
// =============================================================
let __loaderCount = 0;
let __loaderActive = false;

const showGlobalLoader = (title) => {
  try {
    if (!__loaderActive && !Swal.isVisible()) {
      __loaderActive = true;
      Swal.fire({
        title: title || "Cargando...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        customClass: { popup: "global-loader-popup" },
        didOpen: () => Swal.showLoading(),
      });
    }
  } catch {}
};

const hideGlobalLoader = () => {
  try {
    if (__loaderActive) {
      const popup = document.querySelector(".swal2-popup.global-loader-popup");
      if (popup) Swal.close();
    }
  } finally {
    __loaderActive = false;
  }
};

apiClient.interceptors.request.use(
  (config) => {
    if (!config.__skipLoader) {
      __loaderCount += 1;
      if (__loaderCount === 1) showGlobalLoader(config.__loaderTitle || "Cargando...");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const finalizeLoader = (config) => {
  if (!config || config.__skipLoader) return;
  __loaderCount = Math.max(0, __loaderCount - 1);
  if (__loaderCount === 0) hideGlobalLoader();
};

apiClient.interceptors.response.use(
  (response) => {
    finalizeLoader(response?.config);
    return response;
  },
  (error) => {
    finalizeLoader(error?.config);
    return Promise.reject(error);
  }
);

// =============================================================
// 📦 EXPORTS
// =============================================================
export default apiClient;
export {
  getData,
  getBinary,
  postData,
  putData,
  patchData,
  deleteData,
  logout,
  API_URL,
};