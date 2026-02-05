import axios from 'axios';
import Swal from 'sweetalert2';

// =============================================================
// 🌍 SMART ENVIRONMENT DETECTION (LAN / ZeroTier / Localhost)
// =============================================================

// Detecta si está en modo desarrollo automáticamente
const isDevMode =
  process.env.NODE_ENV === 'development' ||
  process.env.REACT_APP_DEVELOPMENT === 'true';

const currentHost = window.location.hostname;
console.log("🔎 HOST detectado:", currentHost);

let API_URL;

// =============================================================
// 🔧 Detección automática del entorno
// =============================================================
if (isDevMode) {
  // MODO DESARROLLO
  if (["localhost", "127.0.0.1"].includes(currentHost)) {
    API_URL = process.env.REACT_APP_API_URL_LOCAL || "http://127.0.0.1:8077/";
    console.log("🧪 DEV → Backend local detectado");
  } else if (currentHost.startsWith("10.")) {
    API_URL = process.env.REACT_APP_API_URL_LAN || "http://10.10.20.16:8077/";
    console.log("📡 DEV → Red LAN detectada");
  } else if (currentHost.startsWith("172.")) {
    API_URL = process.env.REACT_APP_API_URL_ZT || "http://172.25.146.246:8077/";
    console.log("🌍 DEV → Red ZeroTier detectada");
  } else {
    API_URL = process.env.REACT_APP_API_URL_LAN || "http://10.10.20.16:8077/";
    console.log("⚙️ DEV → Fallback a backend LAN");
  }
} else {
  // MODO PRODUCCIÓN
  if (["localhost", "127.0.0.1"].includes(currentHost)) {
    API_URL = process.env.REACT_APP_API_URL_LOCAL || "http://127.0.0.1:8077/";
    console.log("🧪 PROD (local build) → Backend local detectado");
  } else if (currentHost.startsWith("172.")) {
    API_URL = process.env.REACT_APP_API_URL_ZT || "http://172.25.146.246:8077/";
    console.log("🏭 PROD → Red ZeroTier detectada");
  } else {
    API_URL = process.env.REACT_APP_API_URL_LAN || "http://10.10.20.16:8077/";
    console.log("🏭 PROD → Red LAN detectada");
  }
}

console.log("%c🌐 API_URL:", "color: #4CAF50; font-weight: bold;", API_URL);

// =============================================================
// 🚀 AXIOS CLIENT
// =============================================================

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// =============================================================
// 🔐 AUTH HELPERS
// =============================================================

const getAuthToken = () => {
  const token = localStorage.getItem("token");
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
    const headers = {
      ...(getAuthToken() && { Authorization: `Token ${getAuthToken()}` }),
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
    const headers = {
      ...(getAuthToken() && { Authorization: `Token ${getAuthToken()}` }),
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
    const headers = {
      "Content-Type": "application/json",
      ...(getAuthToken() && { Authorization: `Token ${getAuthToken()}` }),
      ...(getUsername() && { "X-User": getUsername() }),
    };
    const response = await apiClient.post(endpoint, data, { headers, ...options });
    return response;
  } catch (error) {
    console.error("❌ Error al enviar datos:", error.response?.data || error);
    throw error;
  }
};

// POST (FORM-DATA)
const postFormData = async (endpoint, data, options = {}) => {
  try {
    const headers = {
      "Content-Type": "multipart/form-data",
      ...(getAuthToken() && { Authorization: `Token ${getAuthToken()}` }),
      ...(getUsername() && { "X-User": getUsername() }),
      ...(options.headers || {}),
    };
    const response = await apiClient.post(endpoint, data, {
      headers,
      timeout: options.timeout || 120000,
      ...options
    });
    return response;
  } catch (error) {
    console.error("❌ Error al enviar form-data:", error.response?.data || error);
    throw error;
  }
};

// PUT
const putData = async (endpoint, data, options = {}) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      ...(getAuthToken() && { Authorization: `Token ${getAuthToken()}` }),
      ...(getUsername() && { "X-User": getUsername() }),
      ...(options.headers || {}),
    };

    // Axios detecta automáticamente FormData y elimina 'Content-Type' para que el navegador ponga el boundary
    // Si data es FormData, Axios lo manejará, pero si forzamos application/json podría fallar.
    // Sin embargo, si options.headers trae 'multipart/form-data', Axios suele respetarlo o necesitar que lo quitemos.
    // Lo mejor es dejar que Axios gestione el Content-Type si es FormData.
    
    if (data instanceof FormData) {
        delete headers["Content-Type"];
    }

    const response = await apiClient.put(endpoint, data, { headers, ...options });
    return response;
  } catch (error) {
    console.error(`❌ Error al actualizar en ${endpoint}:`, error.response?.data || error);
    throw error;
  }
};

// PATCH
const patchData = async (endpoint, data, options = {}) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      ...(getAuthToken() && { Authorization: `Token ${getAuthToken()}` }),
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
    const headers = {
      ...(getAuthToken() && { Authorization: `Token ${getAuthToken()}` }),
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
    const headers = {
      ...(getAuthToken() && { Authorization: `Token ${getAuthToken()}` }),
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
let __sessionExpiryAlert = false;

const showGlobalLoader = (title) => {
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
};

const hideGlobalLoader = () => {
  if (__loaderActive) Swal.close();
  __loaderActive = false;
};

// Interceptores de Axios para el loader
apiClient.interceptors.request.use(
  (config) => {
    if (!config.__skipLoader) {
      __loaderCount += 1;
      if (__loaderCount === 1)
        showGlobalLoader(config.__loaderTitle || "Cargando...");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    if (!response.config.__skipLoader) {
      __loaderCount = Math.max(0, __loaderCount - 1);
      if (__loaderCount === 0) hideGlobalLoader();
    }
    return response;
  },
  (error) => {
    if (!error.config?.__skipLoader) {
      __loaderCount = Math.max(0, __loaderCount - 1);
      if (__loaderCount === 0) hideGlobalLoader();
    }

    const status = error.response?.status;
    const requestURL = error.config?.url || "";

    if (status === 401 && !requestURL.includes("user/login") && !__sessionExpiryAlert) {
      __sessionExpiryAlert = true;
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      const redirectToLogin = () => {
        __sessionExpiryAlert = false;
        // HashRouter usa hash, mantenemos consistencia
        window.location.hash = "#/auth/signin-1";
      };

      // Evita superponer un Swal si ya hay uno visible
      if (Swal.isVisible()) {
        Swal.close();
      }

      Swal.fire({
        icon: "warning",
        title: "Sesión expirada",
        text: "Inicia sesión nuevamente para continuar",
        confirmButtonText: "Ir al inicio de sesión",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(redirectToLogin).catch(redirectToLogin);
    }
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
  postFormData,
  putData,
  patchData,
  deleteData,
  logout,
  API_URL,
};
