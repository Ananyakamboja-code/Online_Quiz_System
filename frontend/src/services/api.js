import axios from 'axios';

/**
 * Centralized Axios instance for the whole app.
 *
 * The backend does not exist yet, so no real requests are made from here.
 * All feature services (admin/student/faculty) should import THIS instance
 * instead of creating their own, so base URL and auth handling stay in one place.
 */

// Future backend base URL. Can be overridden later via a Vite env var
// (VITE_API_BASE_URL) without touching feature code.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor.
 *
 * Placeholder for future JWT auth: when authentication is implemented,
 * read the token (e.g. from localStorage) and attach it here as a
 * Bearer token. Left disabled for now on purpose.
 */
api.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor.
 *
 * Placeholder for future centralized error / auth handling
 * (e.g. redirect to login on 401, refresh tokens, etc.).
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // if (error.response?.status === 401) {
    //   // handle unauthorized (logout / redirect) once auth exists
    // }
    return Promise.reject(error);
  }
);

export default api;
