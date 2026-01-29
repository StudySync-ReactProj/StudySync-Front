import axios from 'axios';

// Use environment variable with fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const serverURL = `${API_BASE_URL}/api`;

const API = axios.create({
  baseURL: serverURL, // Your server address
});

// Automatically add token to every request (if it exists in LocalStorage)
API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  if (user && user.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

export default API;