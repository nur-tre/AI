import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('eduai_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token if invalid/expired session
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/') {
        localStorage.removeItem('eduai_token');
        localStorage.removeItem('eduai_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
