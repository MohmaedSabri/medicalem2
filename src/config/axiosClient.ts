/** @format */

import axios from 'axios';

// Create axios instance
const axiosClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cookie utility functions
const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

// Request interceptor to add auth token
axiosClient.interceptors.request.use(
  (config) => {
    // Get token from cookie
    const token = getCookie('authToken');
    // Get preferred language from localStorage (defaults to 'en')
    const preferredLanguage = typeof window !== 'undefined'
      ? (localStorage.getItem('language') || 'en')
      : 'en';
    
    // If token exists, add it to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Always send Accept-Language so backend can localize
    config.headers['Accept-Language'] = preferredLanguage;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If token is expired or invalid, remove it
    if (error.response?.status === 401) {
      // Remove expired token from cookie
      document.cookie = 'authToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;
