import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors with token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 error and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        try {
          // Try to refresh the access token
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
            headers: {
              'Authorization': `Bearer ${refreshToken}`
            }
          });
          
          const { access_token } = response.data;
          
          // Save new access token
          localStorage.setItem('token', access_token);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
          
        } catch (refreshError) {
          // Refresh failed - clear tokens and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token - clear and redirect
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  verifyOTP: (data) => api.post('/auth/verify-otp', data),
  resendOTP: (email) => api.post('/auth/resend-otp', { email }),
  login: (data) => api.post('/auth/login', data),
  adminLogin: () => api.post('/auth/admin-login'),
  getCurrentUser: () => api.get('/auth/me'),
  refreshToken: () => api.post('/auth/refresh'),
};

// Application API calls
export const applicationAPI = {
  submitApplication: (data) => api.post('/apply', data),
  getApplications: () => api.get('/applications'),
  getAllApplications: () => api.get('/applications/all'),
  updateApplicationStatus: (appId, status) => api.put(`/applications/${appId}/status`, { status }),
  deliverFinalProduct: (appId, deliveryData) => api.put(`/applications/${appId}/deliver`, deliveryData),
};

// Auth helper functions with error handling for localStorage
export const authHelpers = {
  setToken: (token) => {
    try {
      localStorage.setItem('token', token);
    } catch (e) {
      console.error('localStorage unavailable:', e);
      // Fallback: store in memory (less secure, session only)
      window._token = token;
    }
  },
  getToken: () => {
    try {
      return localStorage.getItem('token');
    } catch (e) {
      console.error('localStorage unavailable:', e);
      return window._token || null;
    }
  },
  removeToken: () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    } catch (e) {
      console.error('localStorage unavailable:', e);
      delete window._token;
      delete window._refreshToken;
    }
  },
  setRefreshToken: (refreshToken) => {
    try {
      localStorage.setItem('refreshToken', refreshToken);
    } catch (e) {
      console.error('localStorage unavailable:', e);
      window._refreshToken = refreshToken;
    }
  },
  getRefreshToken: () => {
    try {
      return localStorage.getItem('refreshToken');
    } catch (e) {
      console.error('localStorage unavailable:', e);
      return window._refreshToken || null;
    }
  },
  setUser: (user) => {
    try {
      localStorage.setItem('user', JSON.stringify(user));
    } catch (e) {
      console.error('localStorage unavailable:', e);
      window._user = user;
    }
  },
  getUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (e) {
      console.error('localStorage unavailable:', e);
      return window._user || null;
    }
  },
  removeUser: () => {
    try {
      localStorage.removeItem('user');
    } catch (e) {
      console.error('localStorage unavailable:', e);
      delete window._user;
    }
  },
  isAuthenticated: () => {
    try {
      return !!localStorage.getItem('token');
    } catch (e) {
      return !!window._token;
    }
  },
  logout: () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    } catch (e) {
      delete window._token;
      delete window._refreshToken;
      delete window._user;
    }
    window.location.href = '/login';
  },
};

export default api;
