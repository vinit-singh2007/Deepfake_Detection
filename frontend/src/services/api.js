import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  } catch (error) {
    // Fallback try legacy route if needed
    try {
      const response = await api.post('/login', credentials);
      return response.data;
    } catch {
      const msg = error.response?.data?.detail || 'Login failed! Check your credentials.';
      throw new Error(msg);
    }
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  } catch (error) {
    try {
      const response = await api.post('/register', userData);
      return response.data;
    } catch {
      const msg = error.response?.data?.detail || 'Registration failed! Please try again.';
      throw new Error(msg);
    }
  }
};

export const analyzeVideo = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/api/video/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.detail || 'Video analysis failed. Please try again.';
    throw new Error(msg);
  }
};

export const getAnalysisHistory = async () => {
  try {
    const response = await api.get('/api/video/history');
    return response.data;
  } catch (error) {
    console.error('Error fetching history:', error);
    return [];
  }
};

export default api;
