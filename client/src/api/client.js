import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Outbound interceptor — attach the auth token to every request centrally.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('propspace_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Inbound interceptor — surface a clean message and handle expired sessions.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || 'Something went wrong. Please try again.';
    if (status === 401 && localStorage.getItem('propspace_token')) {
      // Token expired or invalid — clear it so guards redirect cleanly.
      localStorage.removeItem('propspace_token');
    }
    return Promise.reject(new Error(message));
  }
);

export default api;
