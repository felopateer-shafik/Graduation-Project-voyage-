import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

/** Request interceptor — attach JWT if available */
axiosInstance.interceptors.request.use(
  (config) => {
    // JWT is stored in memory (Zustand store), not localStorage
    // The store will set the token on the axios instance when it changes
    return config;
  },
  (error) => Promise.reject(error)
);

/** Response interceptor — handle 401 globally */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear auth state
      // We import dynamically to avoid circular deps
      import('@/store/useAuthStore').then(({ default: useAuthStore }) => {
        useAuthStore.getState().logout();
      });
    }
    return Promise.reject(error);
  }
);

/**
 * Set the Authorization header for all future requests
 * @param {string|null} token
 */
export function setAuthToken(token) {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
}

export default axiosInstance;
