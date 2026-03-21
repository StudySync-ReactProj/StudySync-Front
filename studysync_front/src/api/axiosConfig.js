import axios from 'axios';

// Use environment variable with fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const serverURL = `${API_BASE_URL}/api`;

const API = axios.create({
  baseURL: serverURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically add token to every request (if it exists in LocalStorage)
API.interceptors.request.use(
  (req) => {
    try {
      const userInfoStr = localStorage.getItem('userInfo');
      
      if (userInfoStr) {
        const user = JSON.parse(userInfoStr);
        
        if (user && user.token) {
          req.headers.Authorization = `Bearer ${user.token}`;
          console.log('Token added to request:', req.url);
        } else {
          console.warn('No token found in userInfo for request:', req.url);
        }
      } else {
        console.warn('No userInfo in localStorage for request:', req.url);
      }
    } catch (error) {
      console.error('Error parsing userInfo from localStorage:', error);
    }
    
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// FIXED: Response interceptor to handle 401 errors with logout and redirect
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('401 Unauthorized - Token expired or invalid');
      
      // Step 1: Clear localStorage
      localStorage.removeItem('userInfo');
      localStorage.removeItem('userId');
      localStorage.removeItem('studySyncState');
      console.log('localStorage cleared');
      
      // Step 2: Dispatch Redux logout action
      try {
        const { store } = require('../store/store');
        const { logoutUser } = require('../store/userSlice');
        store.dispatch(logoutUser());
        console.log('Redux state cleared - user logged out');
      } catch (err) {
        console.error('Failed to dispatch logout action:', err);
      }
      
      // Step 3: Redirect to login
      console.log('Redirecting to login...');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
