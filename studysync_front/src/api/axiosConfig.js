import axios from 'axios';

// Use environment variable with fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const serverURL = `${API_BASE_URL}/api`;

const API = axios.create({
  baseURL: serverURL, // Your server address
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically add token to every request (if it exists in LocalStorage)
API.interceptors.request.use(
  (req) => {
    try {
      // Try to get user info from localStorage
      const userInfoStr = localStorage.getItem('userInfo');
      
      if (userInfoStr) {
        const user = JSON.parse(userInfoStr);
        
        // Add token if it exists
        if (user && user.token) {
          req.headers.Authorization = `Bearer ${user.token}`;
          console.log('✅ Token added to request:', req.url);
        } else {
          console.warn('⚠️ No token found in userInfo for request:', req.url);
        }
      } else {
        console.warn('⚠️ No userInfo in localStorage for request:', req.url);
      }
    } catch (error) {
      console.error('❌ Error parsing userInfo from localStorage:', error);
    }
    
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('❌ 401 Unauthorized - Token may be invalid or expired');
      // You can add logic here to redirect to login or refresh token
    }
    return Promise.reject(error);
  }
);

export default API;