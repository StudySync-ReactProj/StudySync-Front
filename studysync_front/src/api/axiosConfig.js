import axios from 'axios';
const serverURL = 'http://localhost:3000/api';

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